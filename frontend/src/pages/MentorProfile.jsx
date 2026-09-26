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
import Input from '../components/Input';
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
      setLoading(true);
      try {
        const [userData, slotsData] = await Promise.all([
          userService.getUserById(id),
          sessionService.getAvailability(id, true).catch(() => []),
        ]);
        const userObj = userData?.user || userData;
        setMentor(userObj || null);
        setReviews(userData?.reviews || []);
        setSlots(slotsData || []);
        if (userObj?.skills?.length > 0) {
          setRequestForm((prev) => ({
            ...prev,
            skill: userObj.skills[0].name,
            message: `Hi ${userObj.name}, I would love to learn ${userObj.skills[0].name} from you!`,
          }));
        }
      } catch (err) {
        console.error('Error fetching mentor profile:', err);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorDetails();
    } else {
      setLoading(false);
    }
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
        mentorId: mentor._id || mentor.id,
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
      <div className="max-w-xl mx-auto py-16 text-center px-4">
        <div className="p-8 rounded-3xl bg-[#080B18]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC]">Mentor not found</h2>
          <p className="text-xs text-[#94A3B8] mt-2 mb-6">
            The requested student mentor profile could not be found or does not exist.
          </p>
          <Link to="/mentors" className="inline-block">
            <Button variant="primary" size="sm" icon={ArrowLeft}>
              Back to Find Mentors
            </Button>
          </Link>
        </div>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Back button */}
      <Link
        to="/mentors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#60A5FA] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Find Mentors
      </Link>

      {/* Top Banner Card */}
      <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8 relative overflow-hidden">
        {/* Glow behind profile */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {mentor.profileImage ? (
                <img
                  src={mentor.profileImage}
                  alt={mentor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/15 shadow-xl ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-xl ring-2 ring-blue-500/20">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                  {mentor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-[#60A5FA] capitalize border border-blue-500/20">
                  {mentor.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8] mb-2">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#60A5FA]" />
                  {mentor.department}
                </span>
                <span>•</span>
                <span>{mentor.year}</span>
                <span>•</span>
                <span>{mentor.college}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <RatingStars rating={mentor.rating || 5.0} count={mentor.ratingsCount || 0} size="sm" />
                <span className="text-white/20">•</span>
                <span className="text-[#CBD5E1] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
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
          <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              About This Student
            </h3>
            <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-3xl">
              {mentor.bio}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Skills + Available Slots + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Skills Offered */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-1">
              Skills Offered
            </h2>
            <p className="text-xs text-[#94A3B8] mb-5">
              Topics and subjects {mentor.name} can mentor you on
            </p>

            <div className="space-y-3">
              {mentor.skills?.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0B1024]/80 border border-white/10 flex items-start justify-between gap-3 hover:border-blue-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#F8FAFC]">{sk.name}</h4>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-[#60A5FA] border border-blue-500/20">
                        {sk.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-[#CBD5E1]">
                        {sk.level}
                      </span>
                    </div>
                    {sk.description && (
                      <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                        {sk.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Reviews Section */}
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Reviews & Feedback ({reviews.length})
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Feedback from campus peers who completed sessions with {mentor.name}
                </p>
              </div>
              <RatingStars rating={mentor.rating || 5.0} size="md" />
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-[#0B1024]/60 border border-white/5 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {rev.learner?.profileImage ? (
                          <img
                            src={rev.learner.profileImage}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                            {rev.learner?.name ? rev.learner.name[0] : 'S'}
                          </div>
                        )}
                        <span className="font-bold text-[#F8FAFC]">
                          {rev.learner?.name || 'Fellow Student'}
                        </span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-[#CBD5E1] italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-[#94A3B8] block mt-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-6 italic">
                No reviews yet for this student mentor.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Available Free Slots */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-1">
              Upcoming Availability
            </h2>
            <p className="text-xs text-[#94A3B8] mb-4">
              Open times {mentor.name} is available for peer sessions
            </p>

            {slots.length > 0 ? (
              <div className="space-y-2.5">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-3 rounded-xl bg-[#0B1024]/70 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#38BDF8]" />
                      <span className="font-bold text-[#F8FAFC]">{slot.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#CBD5E1] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-6 italic">
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
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Request Dispatched!</h4>
            <p className="text-xs text-[#94A3B8]">{requestSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            {requestError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{requestError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
                Select Skill <span className="text-rose-400">*</span>
              </label>
              <select
                value={requestForm.skill}
                onChange={(e) => setRequestForm({ ...requestForm, skill: e.target.value })}
                className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3 bg-[#0B1024]/90 text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              >
                {mentor.skills?.map((sk, idx) => (
                  <option key={idx} value={sk.name} className="bg-[#080B18] text-[#F8FAFC]">
                    {sk.name} ({sk.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
                Message / What you'd like to learn <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                placeholder="Give a brief summary of what you need help with..."
                className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
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
