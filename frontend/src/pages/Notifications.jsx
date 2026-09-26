import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, ArrowLeft } from 'lucide-react';
import notificationService from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import NotificationCard from '../components/NotificationCard';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadNotifications } = useAuth();

  const fetchNotifs = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadNotifications(data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifications(0);
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifications((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#38BDF8] block mb-1">
            Real-Time Alerts
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Stay updated with mentorship requests, session dates, messages, and feedback
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <Loading text="Loading notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif._id}
              notification={notif}
              onMarkRead={handleMarkSingleRead}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-[#080B18]/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <Bell className="w-12 h-12 text-[#60A5FA]/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F8FAFC]">No notifications</h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            You're all caught up! New mentorship alerts and session updates will arrive here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
