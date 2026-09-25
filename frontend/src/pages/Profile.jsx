import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Calendar,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Star,
  Award,
  IdCard,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import feedbackService from '../services/feedbackService';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import Loading from '../components/Loading';

const categoryOptions = [
  'Programming',
  'Web Development',
  'Data Science',
  'AI/ML',
  'Aptitude',
  'Communication',
  'Sports',
  'Music',
  'Arts',
  'Other',
];

const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Add Skill Modal
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
  });
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState('');

  // Add Interest Modal
  const [interestInput, setInterestInput] = useState('');
  const [updatingInterests, setUpdatingInterests] = useState(false);

  useEffect(() => {
    if (user?._id) {
      feedbackService
        .getMentorFeedback(user._id)
        .then((data) => setReviews(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingReviews(false));
    }
  }, [user?._id]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setSkillError('');
    if (!skillForm.name.trim()) {
      setSkillError('Skill name is required');
      return;
    }

    setAddingSkill(true);
    try {
      await userService.addSkill(skillForm);
      await refreshUser();
      setAddSkillModal(false);
      setSkillForm({ name: '', category: 'Programming', level: 'Intermediate', description: '' });
    } catch (err) {
      setSkillError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillName) => {
    if (window.confirm(`Are you sure you want to remove "${skillName}" from your profile?`)) {
      try {
        await userService.removeSkill(skillName);
        await refreshUser();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove skill');
      }
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!interestInput.trim()) return;

    const current = user?.interests || [];
    if (current.includes(interestInput.trim())) {
      setInterestInput('');
      return;
    }

    setUpdatingInterests(true);
    try {
      const updated = [...current, interestInput.trim()];
      await userService.updateInterests(updated);
      await refreshUser();
      setInterestInput('');
    } catch (err) {
      alert('Failed to add learning interest');
    } finally {
      setUpdatingInterests(false);
    }
  };

  const handleRemoveInterest = async (item) => {
    try {
      const updated = (user?.interests || []).filter((i) => i !== item);
      await userService.updateInterests(updated);
      await refreshUser();
    } catch (err) {
      alert('Failed to remove interest');
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-indigo-50 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
                  {user?.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {user?.department}
                </span>
                <span>•</span>
                <span>{user?.year}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-slate-400" />
                  {user?.studentId}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={user?.rating || 5.0} count={user?.ratingsCount || 0} size="sm" />
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  {user?.sessionsCompleted || 0} sessions completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
            <Link to="/profile/edit" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" icon={Edit3} className="w-full">
                Edit Profile
              </Button>
            </Link>
            <Link to="/availability" className="flex-1 sm:flex-initial">
              <Button variant="secondary" size="sm" icon={Clock} className="w-full">
                Set Availability
              </Button>
            </Link>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About Me
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {user.bio}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Skills Offered (Left) + Skills to Learn / Reviews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skills Offered (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Skills I Can Teach (Mentor)
                </h2>
                <p className="text-xs text-slate-500">
                  Skills peers can request 1-on-1 mentorship for
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setAddSkillModal(true)}
              >
                Add Skill
              </Button>
            </div>

            {user?.skills && user.skills.length > 0 ? (
              <div className="space-y-3">
                {user.skills.map((sk, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {sk.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-200 text-slate-700">
                          {sk.level}
                        </span>
                      </div>
                      {sk.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mt-1">
                          {sk.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No skills added yet</p>
                <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                  Share your expertise in programming, academics, sports, or music with campus peers.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={Plus}
                  onClick={() => setAddSkillModal(true)}
                >
                  Add Your First Skill
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interests to Learn + Reviews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills Looking To Learn */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Skills I Want To Learn (Learner)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Topics and domains you are interested in exploring
            </p>

            <form onSubmit={handleAddInterest} className="flex gap-2 mb-4">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="e.g. Photoshop, Guitar, ML"
                className="flex-1 rounded-xl border border-slate-200 text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <Button type="submit" size="sm" isLoading={updatingInterests}>
                Add
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-violet-400 hover:text-violet-700 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No learning goals added yet.</p>
              )}
            </div>
          </div>

          {/* Student Reviews & Feedback */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Peer Reviews & Feedback
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Ratings received after completing 1-on-1 mentorship sessions
            </p>

            {loadingReviews ? (
              <Loading size="sm" text="Loading reviews..." />
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800">
                        {rev.learner?.name || 'Fellow Student'}
                      </span>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-slate-600 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 italic">
                No reviews received yet. Complete sessions to build your rating!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={addSkillModal}
        onClose={() => setAddSkillModal(false)}
        title="Add Skill You Can Teach"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          {skillError && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {skillError}
            </p>
          )}

          <Input
            label="Skill Name"
            placeholder="e.g. Python, Public Speaking, Badminton"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Proficiency Level
              </label>
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {levelOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Short Description / Experience
            </label>
            <textarea
              rows={3}
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              placeholder="What topics can you cover? e.g. Leetcode basics, web APIs, strumming..."
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddSkillModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={addingSkill}
            >
              Save Skill to Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
