import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, CheckCircle2, AlertCircle, ArrowLeft, Award, Calendar, MapPin } from 'lucide-react';
import sessionService from '../services/sessionService';
import feedbackService from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Feedback = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await sessionService.getSessionById(sessionId);
        setSession(data.session);
        setExistingFeedback(data.feedback);
        if (data.feedback) {
          setRating(data.feedback.rating);
          setComment(data.feedback.comment);
        }
      } catch (err) {
        console.error('Error fetching session for feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please choose a star rating (1–5).');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a short review sharing your experience.');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        sessionId,
        rating,
        comment: comment.trim(),
      });

      setSuccess('Feedback submitted successfully! Thank you for supporting peer learning on campus.');
      setTimeout(() => {
        navigate('/sessions');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading session details..." />;
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-[#F8FAFC]">Session Not Found</h2>
        <Link to="/sessions" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Sessions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#60A5FA] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#38BDF8] block mb-1">
          Peer Recognition
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Rate & Review Your Mentor
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Your authentic feedback helps your fellow student build their campus mentorship reputation
        </p>
      </div>

      <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Session details summary */}
        <div className="p-4 rounded-2xl bg-[#0B1024]/90 border border-white/10 flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {session.mentor?.profileImage ? (
              <img
                src={session.mentor.profileImage}
                alt={session.mentor.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {session.mentor?.name ? session.mentor.name[0] : 'M'}
              </div>
            )}
            <div>
              <p className="text-xs text-[#60A5FA] font-semibold uppercase">Mentor</p>
              <h3 className="text-sm font-bold text-[#F8FAFC]">{session.mentor?.name}</h3>
              <p className="text-xs text-[#94A3B8]">{session.mentor?.department}</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-[#60A5FA] font-bold border border-blue-500/25 block mb-1">
              {session.skill}
            </span>
            <span className="text-[#94A3B8]">{session.date}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {existingFeedback ? (
          <div className="p-5 rounded-2xl bg-[#0B1024]/80 border border-white/10 text-center relative z-10">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#F8FAFC] mb-1">Feedback Already Submitted</h3>
            <div className="flex justify-center my-2">
              <RatingStars rating={existingFeedback.rating} size="lg" />
            </div>
            <p className="text-xs text-[#CBD5E1] italic max-w-md mx-auto mb-5">
              "{existingFeedback.comment}"
            </p>
            <Link to="/sessions">
              <Button variant="outline" size="sm">
                Back to Sessions
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Interactive Stars */}
            <div className="text-center py-4 bg-[#0B1024]/80 rounded-2xl border border-white/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-3">
                Overall Session Rating
              </label>
              <div className="flex justify-center">
                <RatingStars
                  rating={rating}
                  interactive
                  size="lg"
                  onChange={(val) => setRating(val)}
                />
              </div>
              <p className="text-xs text-[#38BDF8] font-semibold mt-2">
                {rating === 5 && 'Outstanding session! Extremely helpful.'}
                {rating === 4 && 'Very good session. Learned a lot.'}
                {rating === 3 && 'Good session. Covered the basics.'}
                {rating === 2 && 'Fair. Could be improved.'}
                {rating === 1 && 'Needs significant improvement.'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
                Share your feedback & learning experience <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you learn? How clear was the explanation? Any tips for other students?"
                className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Link to="/sessions">
                <Button variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                size="md"
                icon={Star}
                isLoading={submitting}
              >
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
