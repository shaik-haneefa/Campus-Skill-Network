import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, Check, X, ArrowRight, User } from 'lucide-react';
import Button from './Button';

const statusBadgeStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const RequestCard = ({
  request,
  type = 'received', // 'received' (as mentor) or 'sent' (as learner)
  onAccept,
  onReject,
  onCancel,
  loadingAction = false,
}) => {
  const otherParty = type === 'received' ? request.learner : request.mentor;
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Student Info + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {otherParty?.profileImage ? (
              <img
                src={otherParty.profileImage}
                alt={otherParty.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-100"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                {otherParty?.name ? otherParty.name[0] : 'S'}
              </div>
            )}
            <div>
              <Link
                to={`/mentor/${otherParty?._id}`}
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                {otherParty?.name || 'Student'}
              </Link>
              <div className="text-xs text-slate-500">
                {otherParty?.department || 'Department'} • {otherParty?.year || ''}
              </div>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize ${
              statusBadgeStyles[request.status] || statusBadgeStyles.pending
            }`}
          >
            {request.status}
          </span>
        </div>

        {/* Skill tag */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-slate-500">Skill requested: </span>
          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {request.skill}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mb-3 italic leading-relaxed border border-slate-100">
          "{request.message}"
        </p>

        {/* Preferred Date & Time */}
        {(request.preferredDate || request.preferredTime) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
            {request.preferredDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred: {request.preferredDate}</span>
              </div>
            )}
            {request.preferredTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.preferredTime}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footers */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        {type === 'received' && isPending && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => onReject(request._id)}
              disabled={loadingAction}
              className="text-rose-600 hover:text-rose-700 hover:border-rose-300"
            >
              Decline
            </Button>
            <Button
              variant="success"
              size="sm"
              icon={Check}
              onClick={() => onAccept(request._id)}
              disabled={loadingAction}
            >
              Accept Request
            </Button>
          </>
        )}

        {type === 'received' && isAccepted && (
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-4 h-4" /> Accepted
            </span>
            <div className="flex gap-2">
              <Link to="/availability">
                <Button variant="outline" size="sm">
                  My Slots
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="primary" size="sm" icon={MessageSquare}>
                  Chat
                </Button>
              </Link>
            </div>
          </div>
        )}

        {type === 'sent' && isPending && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(request._id)}
            disabled={loadingAction}
            className="text-rose-600 hover:bg-rose-50"
          >
            Cancel Request
          </Button>
        )}

        {type === 'sent' && isAccepted && (
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs text-emerald-600 font-medium">Ready to schedule</span>
            <div className="flex gap-2">
              <Link to={`/schedule/${request._id}`}>
                <Button variant="primary" size="sm" icon={ArrowRight}>
                  Book Slot
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" size="sm" icon={MessageSquare}>
                  Chat
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
