import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, MessageSquare, Star, Ban } from 'lucide-react';
import Button from './Button';

const sessionBadgeStyles = {
  scheduled: 'bg-blue-500/15 text-[#60A5FA] border-blue-500/25',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

const SessionCard = ({
  session,
  currentUserId,
  onComplete,
  onCancel,
  loadingAction = false,
}) => {
  const isLearner = session.learner?._id?.toString() === currentUserId?.toString();
  const partner = isLearner ? session.mentor : session.learner;
  const isScheduled = session.status === 'scheduled';
  const isCompleted = session.status === 'completed';

  return (
    <div className="bg-[#0B1024]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top bar: Skill + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold text-[#94A3B8] block mb-1">
              Peer Learning Session
            </span>
            <h3 className="text-base font-bold text-[#F8FAFC] line-clamp-1">
              {session.skill}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize ${
              sessionBadgeStyles[session.status] || sessionBadgeStyles.scheduled
            }`}
          >
            {session.status}
          </span>
        </div>

        {/* Partner Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#080B18]/90 border border-white/10 mb-4">
          {partner?.profileImage ? (
            <img
              src={partner.profileImage}
              alt={partner.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/15"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {partner?.name ? partner.name[0] : 'U'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs text-[#94A3B8] font-medium">
              {isLearner ? 'Mentor' : 'Learner'}
            </div>
            <div className="text-sm font-bold text-[#F8FAFC] truncate">
              {partner?.name || 'Student Peer'}
            </div>
            <div className="text-xs text-[#CBD5E1] truncate">
              {partner?.department}
            </div>
          </div>
        </div>

        {/* Schedule & Location details */}
        <div className="space-y-2 mb-4 text-xs text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
            <span className="font-semibold text-[#F8FAFC]">{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
            <span>{session.startTime} – {session.endTime}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium text-[#F8FAFC]">{session.location}</span>
          </div>
        </div>

        {session.notes && (
          <p className="text-xs text-[#CBD5E1] italic bg-white/[0.04] p-2.5 rounded-lg border border-white/10 mb-3">
            Note: {session.notes}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <Link to="/chat">
          <Button variant="ghost" size="sm" icon={MessageSquare}>
            Chat
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {isScheduled && (
            <>
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(session._id)}
                  disabled={loadingAction}
                  className="!text-rose-400 !border-rose-500/25 hover:!bg-rose-500/10"
                >
                  Cancel
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle}
                  onClick={() => onComplete(session._id)}
                  disabled={loadingAction}
                >
                  Mark Complete
                </Button>
              )}
            </>
          )}

          {isCompleted && isLearner && (
            session.hasFeedback ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Feedback Given
              </span>
            ) : (
              <Link to={`/feedback/${session._id}`}>
                <Button variant="secondary" size="sm" icon={Star}>
                  Rate & Review
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
