import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const categoryBadges = {
  Programming: 'bg-[rgba(37,99,235,0.12)] border-[rgba(96,165,250,0.35)] text-[#60A5FA]',
  'AI/ML': 'bg-[rgba(124,58,237,0.12)] border-[rgba(167,139,250,0.35)] text-[#A78BFA]',
  Communication: 'bg-[rgba(236,72,153,0.08)] border-[rgba(244,114,182,0.30)] text-[#F9A8D4]',
  Sports: 'bg-[rgba(16,185,129,0.08)] border-[rgba(52,211,153,0.30)] text-[#6EE7B7]',
  Arts: 'bg-[rgba(249,115,22,0.08)] border-[rgba(251,146,60,0.30)] text-[#FDBA74]',
  'Web Development': 'bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.30)] text-[#67E8F9]',
  'Data Science': 'bg-[rgba(37,99,235,0.12)] border-[rgba(96,165,250,0.35)] text-[#60A5FA]',
  Aptitude: 'bg-[rgba(245,158,11,0.08)] border-[rgba(251,191,36,0.30)] text-[#FCD34D]',
  Music: 'bg-[rgba(217,70,239,0.08)] border-[rgba(232,121,249,0.30)] text-[#F0ABFC]',
  Other: 'bg-[rgba(148,163,184,0.08)] border-[rgba(148,163,184,0.25)] text-[#CBD5E1]',
};

const SkillCard = ({ skill }) => {
  const badgeStyle = categoryBadges[skill.category] || categoryBadges.Other;

  return (
    <div
      className="group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between bg-[rgba(15,23,42,0.72)] backdrop-blur-md border border-[rgba(148,163,184,0.16)] shadow-xl hover:border-[rgba(59,130,246,0.45)] hover:shadow-[0_0_20px_rgba(37,99,235,0.15),0_0_35px_rgba(124,58,237,0.08)] hover:bg-[#10192F]/90 hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border ${badgeStyle}`}
          >
            {skill.category}
          </span>
          {skill.mentorCount !== undefined && (
            <div className="flex items-center text-xs font-medium gap-1 text-[#CBD5E1]">
              <Users className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#60A5FA] transition-colors" />
              <span>
                {skill.mentorCount} {skill.mentorCount === 1 ? 'mentor' : 'mentors'}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors line-clamp-1">
          {skill.name}
        </h3>

        {skill.description && (
          <p className="mt-2 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
            {skill.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between">
        <Link
          to={`/mentors?skill=${encodeURIComponent(skill.name)}`}
          className="text-xs font-semibold text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
        >
          Find Peer Mentors <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
