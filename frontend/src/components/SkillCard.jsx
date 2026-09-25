import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ArrowRight } from 'lucide-react';

const categoryColors = {
  Programming: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Web Development': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'Data Science': 'bg-blue-50 text-blue-700 border-blue-100',
  'AI/ML': 'bg-purple-50 text-purple-700 border-purple-100',
  Aptitude: 'bg-amber-50 text-amber-700 border-amber-100',
  Communication: 'bg-rose-50 text-rose-700 border-rose-100',
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Music: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  Arts: 'bg-orange-50 text-orange-700 border-orange-100',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const SkillCard = ({ skill, onSelect, compact = false }) => {
  const badgeColor = categoryColors[skill.category] || categoryColors.Other;

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 shadow-card hover:shadow-soft-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border ${badgeColor}`}
          >
            {skill.category}
          </span>
          {skill.mentorCount !== undefined && (
            <div className="flex items-center text-xs text-slate-500 font-medium gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{skill.mentorCount} {skill.mentorCount === 1 ? 'mentor' : 'mentors'}</span>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {skill.name}
        </h3>

        {skill.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {skill.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/mentors?skill=${encodeURIComponent(skill.name)}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Find Peer Mentors <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
