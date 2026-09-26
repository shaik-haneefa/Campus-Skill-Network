import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050713]/85 backdrop-blur-md">
        <div className="flex flex-col items-center p-6 rounded-2xl bg-[#080B18] shadow-2xl border border-white/10 max-w-xs text-center">
          <div className="relative mb-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-[#3B82F6] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#F8FAFC]">{text}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Campus Skill Network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-[#3B82F6] mb-2`} />
      {text && <p className="text-sm text-[#94A3B8] font-medium">{text}</p>}
    </div>
  );
};

export default Loading;
