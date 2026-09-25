import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, MessageSquare, Star, Ban } from 'lucide-react';
import Button from './Button';

const sessionBadgeStyles = {
  scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top bar: Skill + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Peer Learning Session
            </span>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">
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
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          {partner?.profileImage ? (
            <img
              src={partner.profileImage}
              alt={partner.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {partner?.name ? partner.name[0] : 'U'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400 font-medium">
              {isLearner ? 'Mentor' : 'Learner'}
            </div>
            <div className="text-sm font-bold text-slate-800 truncate">
              {partner?.name || 'Student Peer'}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {partner?.department}
            </div>
          </div>
        </div>

        {/* Schedule & Location details */}
        <div className="space-y-2 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="font-semibold text-slate-800">{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>{session.startTime} – {session.endTime}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="font-medium text-slate-700">{session.location}</span>
          </div>
        </div>

        {session.notes && (
          <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/60 mb-3">
            Note: {session.notes}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
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
                  className="text-rose-600 hover:text-rose-700"
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
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
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
