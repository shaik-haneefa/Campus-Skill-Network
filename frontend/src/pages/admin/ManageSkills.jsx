import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import skillService from '../../services/skillService';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Programming', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const [skillsData, catsData] = await Promise.all([
        skillService.getSkills({ search }),
        skillService.getCategories(),
      ]);
      setSkills(skillsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Error fetching admin skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setForm({ name: '', category: 'Programming', description: '' });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      description: skill.description || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Skill name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill._id, form);
      } else {
        await skillService.createSkill(form);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill from the campus catalog?')) return;
    try {
      await skillService.deleteSkill(id);
      fetchSkills();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting skill');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 block mb-1">
            Curriculum & Taxonomy
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Campus Skills
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add, update, or curate the skill subjects offered across campus departments
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <Sidebar isAdminPanel />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex gap-2">
            <Input
              placeholder="Search skill catalog..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button size="md" onClick={fetchSkills}>
              Search
            </Button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
            {loading ? (
              <Loading text="Loading skills catalog..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Skill Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Mentors</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skills.map((sk) => (
                      <tr key={sk._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                          {sk.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                            {sk.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                          {sk.mentorCount || 0} students
                        </td>
                        <td className="px-6 py-4 max-w-sm truncate text-slate-500">
                          {sk.description || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(sk)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sk._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <Input
            label="Skill Name"
            placeholder="e.g. Flutter, Rust, Public Speaking"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {categories.map((c) => (
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
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What topics or syllabus does this skill cover?"
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
              isLoading={saving}
            >
              {editingSkill ? 'Save Changes' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSkills;
