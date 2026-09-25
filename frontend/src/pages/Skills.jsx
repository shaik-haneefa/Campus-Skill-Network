import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Plus, ArrowRight } from 'lucide-react';
import skillService from '../services/skillService';
import SkillCard from '../components/SkillCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Propose/Create new skill modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Programming', description: '' });
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [skillsData, catsData] = await Promise.all([
          skillService.getSkills(),
          skillService.getCategories(),
        ]);
        setSkills(skillsData);
        setCategories(['All', ...catsData]);
      } catch (err) {
        console.error('Error fetching skills catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSearch = async (cat, term) => {
    setLoading(true);
    try {
      const data = await skillService.getSkills({
        category: cat !== 'All' ? cat : undefined,
        search: term || undefined,
      });
      setSkills(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onCategoryClick = (cat) => {
    setSelectedCategory(cat);
    handleSearch(cat, search);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(selectedCategory, search);
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newSkill.name.trim()) {
      setModalError('Skill name is required');
      return;
    }

    setCreating(true);
    try {
      await skillService.createSkill(newSkill);
      setModalOpen(false);
      setNewSkill({ name: '', category: 'Programming', description: '' });
      // Refresh list
      handleSearch(selectedCategory, search);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
            Campus Knowledge Exchange
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Skills
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover what students on campus are learning and teaching
          </p>
        </div>

        {isAuthenticated && (
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Add New Skill to Catalog
          </Button>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card mb-8 space-y-4">
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search skills e.g. Python, Java, Guitar, Public Speaking..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="md">
            Search
          </Button>
        </form>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <Loading text="Loading skills catalog..." />
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-8 shadow-card">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No skills found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            We couldn't find any skill matching "{search}" in this category. Propose adding it to the catalog!
          </p>
          {isAuthenticated && (
            <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
              Propose New Skill
            </Button>
          )}
        </div>
      )}

      {/* Add Skill Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Skill to Catalog"
      >
        <form onSubmit={handleCreateSkill} className="space-y-4">
          {modalError && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {modalError}
            </p>
          )}

          <Input
            label="Skill Name"
            placeholder="e.g. Kotlin, Docker, Debate, Chess"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              placeholder="Brief description of this skill and what students can expect to learn..."
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={creating}
            >
              Add to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Skills;
