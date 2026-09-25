import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, MessageSquare, Star, UserPlus, ArrowRight } from 'lucide-react';

const typeIcons = {
  request: { icon: UserPlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  session: { icon: Calendar, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  chat: { icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  feedback: { icon: Star, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  system: { icon: Bell, color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

const NotificationCard = ({ notification, onMarkRead }) => {
  const iconConfig = typeIcons[notification.type] || typeIcons.system;
  const IconComponent = iconConfig.icon;

  const content = (
    <div
      onClick={() => !notification.isRead && onMarkRead && onMarkRead(notification._id)}
      className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
        notification.isRead
          ? 'bg-white border-slate-200/80 hover:bg-slate-50/50'
          : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/70 shadow-sm'
      }`}
    >
      <div className={`p-2.5 rounded-xl border flex-shrink-0 ${iconConfig.color}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold truncate ${notification.isRead ? 'text-slate-800' : 'text-slate-900 font-bold'}`}>
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0" title="Unread" />
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{new Date(notification.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
          {notification.link && (
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline">
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
