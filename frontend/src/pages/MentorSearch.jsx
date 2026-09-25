import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Compass, Users, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import userService from '../services/userService';
import skillService from '../services/skillService';
import requestService from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import MentorCard from '../components/MentorCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const departmentsList = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & AI',
  'Business Administration (MBA)',
];

const MentorSearch = () => {
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSkill);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [sortBy, setSortBy] = useState('rating');
  const [categories, setCategories] = useState([]);

  // Mentorship Request Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    skill: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    skillService.getCategories().then((cats) => setCategories(['All', ...cats]));
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers({
        search: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        department: selectedDepartment !== 'All Departments' ? selectedDepartment : undefined,
        sort: sortBy,
      });

      // Show students who have at least one skill offered, and exclude self if logged in
      const validMentors = data.filter(
        (m) => m.skills && m.skills.length > 0 && m._id !== user?._id
      );

      setMentors(validMentors);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [selectedCategory, selectedDepartment, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleOpenRequest = (mentor) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setSelectedMentor(mentor);
    setRequestForm({
      skill: mentor.skills[0]?.name || '',
      message: `Hi ${mentor.name}, I would love to learn ${mentor.skills[0]?.name || 'this skill'} from you on campus!`,
      preferredDate: '',
      preferredTime: '',
    });
    setRequestError('');
    setRequestSuccess('');
    setRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');

    if (!requestForm.skill || !requestForm.message.trim()) {
      setRequestError('Please choose a skill and enter a message for the mentor.');
      return;
    }

    setSendingRequest(true);
    try {
      await requestService.sendRequest({
        mentorId: selectedMentor._id,
        skill: requestForm.skill,
        message: requestForm.message.trim(),
        preferredDate: requestForm.preferredDate,
        preferredTime: requestForm.preferredTime,
      });

      setRequestSuccess('Mentorship request sent successfully! You will be notified once accepted.');
      setTimeout(() => {
        setRequestModalOpen(false);
        setRequestSuccess('');
      }, 2000);
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Mentorship request could not be sent.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
          Campus Peer Directory
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find a Peer Mentor
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect 1-on-1 with verified students across campus who know the skills you want to learn
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search by student name, skill (e.g. Python, DSA, Debate), or keyword..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="md">
            Find Mentors
          </Button>
        </form>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 text-xs py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 text-xs py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 text-xs py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="rating">Highest Rated Mentor (Default)</option>
              <option value="sessions">Most Completed Sessions</option>
              <option value="newest">Recently Joined Peers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <Loading text="Finding campus mentors..." />
      ) : mentors.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
            <span>Showing {mentors.length} student mentors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onRequestClick={handleOpenRequest}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-8 shadow-card">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No mentors found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Try adjusting your search query, selecting "All Departments", or checking another category.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDepartment('All Departments');
              fetchMentors();
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Request Mentorship Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Request Mentorship with ${selectedMentor?.name || 'Student'}`}
      >
        {requestSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Request Sent!</h4>
            <p className="text-xs text-slate-600 mb-4">{requestSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{requestError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Which skill do you want to learn? <span className="text-rose-500">*</span>
              </label>
              <select
                value={requestForm.skill}
                onChange={(e) => setRequestForm({ ...requestForm, skill: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              >
                {selectedMentor?.skills?.map((sk, idx) => (
                  <option key={idx} value={sk.name}>
                    {sk.name} ({sk.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message to Mentor <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                placeholder="Explain what specific concept you need help with..."
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Preferred Date (Optional)"
                type="date"
                value={requestForm.preferredDate}
                onChange={(e) => setRequestForm({ ...requestForm, preferredDate: e.target.value })}
              />

              <Input
                label="Preferred Time (Optional)"
                placeholder="e.g. 4:00 PM"
                value={requestForm.preferredTime}
                onChange={(e) => setRequestForm({ ...requestForm, preferredTime: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRequestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={sendingRequest}
              >
                Send Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MentorSearch;
