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
        <h2 className="text-xl font-bold text-slate-800">Session Not Found</h2>
        <Link to="/sessions" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Sessions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
          Peer Recognition
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Rate & Review Your Mentor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your authentic feedback helps your fellow student build their campus mentorship reputation
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        {/* Session details summary */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {session.mentor?.profileImage ? (
              <img
                src={session.mentor.profileImage}
                alt={session.mentor.name}
                className="w-12 h-12 rounded-xl object-cover border border-indigo-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                {session.mentor?.name ? session.mentor.name[0] : 'M'}
              </div>
            )}
            <div>
              <p className="text-xs text-indigo-600 font-semibold uppercase">Mentor</p>
              <h3 className="text-sm font-bold text-slate-900">{session.mentor?.name}</h3>
              <p className="text-xs text-slate-500">{session.mentor?.department}</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 font-bold border border-indigo-100 block mb-1">
              {session.skill}
            </span>
            <span className="text-slate-400">{session.date}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {existingFeedback ? (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Feedback Already Submitted</h3>
            <div className="flex justify-center my-2">
              <RatingStars rating={existingFeedback.rating} size="lg" />
            </div>
            <p className="text-xs text-slate-600 italic max-w-md mx-auto mb-5">
              "{existingFeedback.comment}"
            </p>
            <Link to="/sessions">
              <Button variant="outline" size="sm">
                Back to Sessions
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Interactive Stars */}
            <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
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
              <p className="text-xs text-indigo-600 font-semibold mt-2">
                {rating === 5 && 'Outstanding session! Extremely helpful.'}
                {rating === 4 && 'Very good session. Learned a lot.'}
                {rating === 3 && 'Good session. Covered the basics.'}
                {rating === 2 && 'Fair. Could be improved.'}
                {rating === 1 && 'Needs significant improvement.'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                Share your feedback & learning experience <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you learn? How clear was the explanation? Any tips for other students?"
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
