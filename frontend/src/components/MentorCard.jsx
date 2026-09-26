import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import RatingStars from './RatingStars';
import Button from './Button';

const levelColors = {
  Beginner: 'bg-slate-800 text-slate-300 border-slate-700',
  Intermediate: 'bg-blue-500/10 text-[#60A5FA] border-blue-500/25',
  Advanced: 'bg-purple-500/10 text-[#A78BFA] border-purple-500/25',
  Expert: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
};

const MentorCard = ({ mentor, onRequestClick }) => {
  const mentorId = mentor?._id || mentor?.id;
  const initials = mentor?.name
    ? mentor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="bg-[#0B1024]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl hover:shadow-2xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Mentor Top Info */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative flex-shrink-0">
            {mentor.profileImage ? (
              <img
                src={mentor.profileImage}
                alt={mentor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/15 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/20 border border-white/15">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B1024]" title="Active Student" />
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/mentor/${mentorId}`}
              className="text-base font-bold text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors truncate block"
            >
              {mentor.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1] mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-[#60A5FA]" />
              <span className="truncate">{mentor.department}</span>
            </div>
            <div className="text-xs text-[#94A3B8] font-medium mt-0.5">
              {mentor.year} • {mentor.college?.split(' ')[0] || 'Campus'}
            </div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#080B18]/90 border border-white/10 mb-4 text-xs">
          <RatingStars rating={mentor.rating || 5.0} count={mentor.ratingsCount || 0} size="sm" />
          <div className="flex items-center gap-1 text-[#CBD5E1] font-medium">
            <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{mentor.sessionsCompleted || 0} sessions</span>
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p className="text-xs text-[#94A3B8] line-clamp-2 mb-4 leading-relaxed italic">
            "{mentor.bio}"
          </p>
        )}

        {/* Skills Tag list */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
            Skills Offered
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mentor.skills && mentor.skills.length > 0 ? (
              mentor.skills.slice(0, 3).map((sk, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${
                    levelColors[sk.level] || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {sk.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#94A3B8]">No skills listed yet</span>
            )}
            {mentor.skills && mentor.skills.length > 3 && (
              <span className="text-xs text-[#94A3B8] self-center">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
        <Link to={`/mentor/${mentorId}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
        {onRequestClick && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestClick(mentor)}
            className="flex-1"
          >
            Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default MentorCard;
