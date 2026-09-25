import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Star,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import userService from '../services/userService';
import sessionService from '../services/sessionService';
import requestService from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import Loading from '../components/Loading';

const MentorProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    skill: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const [userData, slotsData] = await Promise.all([
          userService.getUserById(id),
          sessionService.getAvailability(id, true),
        ]);
        setMentor(userData.user);
        setReviews(userData.reviews || []);
        setSlots(slotsData || []);
        if (userData.user?.skills?.length > 0) {
          setRequestForm((prev) => ({
            ...prev,
            skill: userData.user.skills[0].name,
            message: `Hi ${userData.user.name}, I would love to learn ${userData.user.skills[0].name} from you!`,
          }));
        }
      } catch (err) {
        console.error('Error fetching mentor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [id]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setRequestError('');
    setRequestSuccess('');

    if (!requestForm.skill || !requestForm.message.trim()) {
      setRequestError('Please select a skill and write a request message.');
      return;
    }

    setSendingRequest(true);
    try {
      await requestService.sendRequest({
        mentorId: mentor._id,
        skill: requestForm.skill,
        message: requestForm.message.trim(),
        preferredDate: requestForm.preferredDate,
        preferredTime: requestForm.preferredTime,
      });

      setRequestSuccess('Mentorship request sent successfully! You will be alerted when accepted.');
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

  if (loading) {
    return <Loading text="Loading mentor profile..." />;
  }

  if (!mentor) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Student Profile Not Found</h2>
        <Link to="/mentors" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const isSelf = currentUser?._id?.toString() === mentor._id?.toString();

  const initials = mentor.name
    ? mentor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/mentors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Mentor Search
      </Link>

      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {mentor.profileImage ? (
                <img
                  src={mentor.profileImage}
                  alt={mentor.name}
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
                  {mentor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
                  {mentor.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {mentor.department}
                </span>
                <span>•</span>
                <span>{mentor.year}</span>
                <span>•</span>
                <span>{mentor.college}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <RatingStars rating={mentor.rating || 5.0} count={mentor.ratingsCount || 0} size="sm" />
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  {mentor.sessionsCompleted || 0} sessions completed
                </span>
              </div>
            </div>
          </div>

          {!isSelf && (
            <Button
              size="md"
              icon={Sparkles}
              onClick={() => setRequestModalOpen(true)}
              className="w-full sm:w-auto shadow-md"
            >
              Request Mentorship
            </Button>
          )}
        </div>

        {mentor.bio && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About This Student
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {mentor.bio}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Skills + Available Slots + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Skills Offered */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Skills Offered
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Topics and subjects {mentor.name} can mentor you on
            </p>

            <div className="space-y-3">
              {mentor.skills?.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3"
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
                </div>
              ))}
            </div>
          </div>

          {/* Peer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Reviews & Feedback ({reviews.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Feedback from campus peers who completed sessions with {mentor.name}
                </p>
              </div>
              <RatingStars rating={mentor.rating || 5.0} size="md" />
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {rev.learner?.profileImage ? (
                          <img
                            src={rev.learner.profileImage}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                            {rev.learner?.name ? rev.learner.name[0] : 'S'}
                          </div>
                        )}
                        <span className="font-bold text-slate-800">
                          {rev.learner?.name || 'Fellow Student'}
                        </span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-slate-600 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic">
                No reviews yet for this student mentor.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Available Free Slots */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Upcoming Availability
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Open times {mentor.name} is available for peer sessions
            </p>

            {slots.length > 0 ? (
              <div className="space-y-2.5">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-800">{slot.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic">
                No open slots currently listed. You can still send a mentorship request with your preferred time!
              </p>
            )}

            {!isSelf && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setRequestModalOpen(true)}
                className="w-full mt-5"
              >
                Request 1-on-1 Mentorship
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Request Mentorship with ${mentor.name}`}
      >
        {requestSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Request Dispatched!</h4>
            <p className="text-xs text-slate-600">{requestSuccess}</p>
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
                Select Skill <span className="text-rose-500">*</span>
              </label>
              <select
                value={requestForm.skill}
                onChange={(e) => setRequestForm({ ...requestForm, skill: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              >
                {mentor.skills?.map((sk, idx) => (
                  <option key={idx} value={sk.name}>
                    {sk.name} ({sk.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message / What you'd like to learn <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                placeholder="Give a brief summary of what you need help with..."
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Preferred Date"
                type="date"
                value={requestForm.preferredDate}
                onChange={(e) => setRequestForm({ ...requestForm, preferredDate: e.target.value })}
              />

              <Input
                label="Preferred Time"
                placeholder="e.g. 2:00 PM"
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

export default MentorProfile;
