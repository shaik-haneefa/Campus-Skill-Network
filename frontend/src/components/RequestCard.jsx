import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, Check, X, ArrowRight, User } from 'lucide-react';
import Button from './Button';

const statusBadgeStyles = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  cancelled: 'bg-slate-800 text-slate-400 border-slate-700',
  completed: 'bg-blue-500/10 text-[#60A5FA] border-blue-500/20',
};

const RequestCard = ({
  request,
  type = 'received',
  onAccept,
  onReject,
  onCancel,
  loadingAction = false,
}) => {
  const otherParty = type === 'received' ? request.learner : request.mentor;
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';

  return (
    <div className="bg-[#0B1024]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header: Student Info + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {otherParty?.profileImage ? (
              <img
                src={otherParty.profileImage}
                alt={otherParty.name}
                className="w-11 h-11 rounded-xl object-cover border border-white/15"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {otherParty?.name ? otherParty.name[0] : 'S'}
              </div>
            )}
            <div>
              <Link
                to={`/mentor/${otherParty?._id}`}
                className="text-sm font-bold text-[#F8FAFC] hover:text-[#60A5FA] transition-colors"
              >
                {otherParty?.name || 'Student'}
              </Link>
              <div className="text-xs text-[#94A3B8]">
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
          <span className="text-xs font-semibold text-[#94A3B8]">Skill requested: </span>
          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-500/15 text-[#60A5FA] border border-blue-500/25">
            {request.skill}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-[#CBD5E1] bg-[#080B18]/90 rounded-xl p-3 mb-3 italic leading-relaxed border border-white/10">
          "{request.message}"
        </p>

        {/* Preferred Date & Time */}
        {(request.preferredDate || request.preferredTime) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] mb-4">
            {request.preferredDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Preferred: {request.preferredDate}</span>
              </div>
            )}
            {request.preferredTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{request.preferredTime}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footers */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-end gap-2">
        {type === 'received' && isPending && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => onReject(request._id)}
              disabled={loadingAction}
              className="!text-rose-400 !border-rose-500/25 hover:!bg-rose-500/10"
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
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
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
            className="text-rose-400 hover:bg-rose-500/10"
          >
            Cancel Request
          </Button>
        )}

        {type === 'sent' && isAccepted && (
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs text-emerald-400 font-medium">Ready to schedule</span>
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
