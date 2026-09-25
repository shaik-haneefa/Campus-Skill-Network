import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import RatingStars from './RatingStars';
import Button from './Button';

const levelColors = {
  Beginner: 'bg-slate-100 text-slate-700',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-100',
  Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Expert: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const MentorCard = ({ mentor, onRequestClick }) => {
  const initials = mentor.name
    ? mentor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Mentor Top Info */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative flex-shrink-0">
            {mentor.profileImage ? (
              <img
                src={mentor.profileImage}
                alt={mentor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Student" />
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/mentor/${mentor._id}`}
              className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block"
            >
              {mentor.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span className="truncate">{mentor.department}</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {mentor.year} • {mentor.college?.split(' ')[0] || 'Campus'}
            </div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
          <RatingStars rating={mentor.rating || 5.0} count={mentor.ratingsCount || 0} size="sm" />
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>{mentor.sessionsCompleted || 0} sessions</span>
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed italic">
            "{mentor.bio}"
          </p>
        )}

        {/* Skills Tag list */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Skills Offered
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mentor.skills && mentor.skills.length > 0 ? (
              mentor.skills.slice(0, 3).map((sk, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${
                    levelColors[sk.level] || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {sk.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No skills listed yet</span>
            )}
            {mentor.skills && mentor.skills.length > 3 && (
              <span className="text-xs text-slate-400 self-center">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link to={`/mentor/${mentor._id}`} className="flex-1">
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
