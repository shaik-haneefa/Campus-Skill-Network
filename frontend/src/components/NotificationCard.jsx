import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, MessageSquare, Star, UserPlus, ArrowRight } from 'lucide-react';

const typeIcons = {
  request: { icon: UserPlus, color: 'text-[#60A5FA] bg-blue-500/15 border-blue-500/25' },
  session: { icon: Calendar, color: 'text-[#38BDF8] bg-cyan-500/15 border-cyan-500/25' },
  chat: { icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' },
  feedback: { icon: Star, color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' },
  system: { icon: Bell, color: 'text-[#CBD5E1] bg-white/[0.05] border-white/10' },
};

const NotificationCard = ({ notification, onMarkRead }) => {
  const iconConfig = typeIcons[notification.type] || typeIcons.system;
  const IconComponent = iconConfig.icon;

  const content = (
    <div
      onClick={() => !notification.isRead && onMarkRead && onMarkRead(notification._id)}
      className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer backdrop-blur-md ${
        notification.isRead
          ? 'bg-[#080B18]/70 border-white/10 hover:bg-[#0B1024]/90'
          : 'bg-[#0B1024]/90 border-blue-500/30 hover:border-blue-500/50 shadow-lg shadow-blue-500/5'
      }`}
    >
      <div className={`p-2.5 rounded-xl border flex-shrink-0 ${iconConfig.color}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold truncate ${notification.isRead ? 'text-[#CBD5E1]' : 'text-[#F8FAFC] font-bold'}`}>
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-sm shadow-blue-400 flex-shrink-0" title="Unread" />
          )}
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed mb-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{new Date(notification.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
          {notification.link && (
            <span className="text-[#60A5FA] font-semibold flex items-center gap-0.5 hover:underline">
              View details <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link to={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default NotificationCard;
