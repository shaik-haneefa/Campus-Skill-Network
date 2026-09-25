import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Inbox,
  Sparkles,
  BookOpen,
  Star,
  Clock,
  ArrowRight,
  PlusCircle,
  Compass,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import sessionService from '../services/sessionService';
import requestService from '../services/requestService';
import notificationService from '../services/notificationService';
import Button from '../components/Button';
import Loading from '../components/Loading';
import SessionCard from '../components/SessionCard';
import RequestCard from '../components/RequestCard';
import RatingStars from '../components/RatingStars';

const Dashboard = () => {
  const { user } = useAuth();

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sessionsData, requestsData, notifsData] = await Promise.all([
          sessionService.getSessions({ status: 'scheduled' }),
          requestService.getReceivedRequests(),
          notificationService.getNotifications(),
        ]);

        setUpcomingSessions(sessionsData.slice(0, 3));
        setPendingRequests(requestsData.filter((r) => r.status === 'pending').slice(0, 3));
        setRecentNotifications(notifsData.notifications?.slice(0, 4) || []);
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading text="Loading your campus dashboard..." />;
  }

  // Calculate profile completion percentage
  let completionPoints = 0;
  if (user?.name) completionPoints += 20;
  if (user?.department) completionPoints += 20;
  if (user?.bio) completionPoints += 20;
  if (user?.skills && user.skills.length > 0) completionPoints += 20;
  if (user?.interests && user.interests.length > 0) completionPoints += 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-8 mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/50 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              <span>{user?.college || 'Campus University'} • {user?.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-indigo-200 max-w-xl">
              You are currently active as both a <strong className="text-white">Learner</strong> and a <strong className="text-white">Mentor</strong>. Explore skills, manage slots, or schedule peer learning.
            </p>
          </div>

          {/* Quick Action Buttons in Banner */}
          <div className="flex flex-wrap gap-2.5">
            <Link to="/mentors">
              <Button size="sm" icon={Compass} className="bg-white text-indigo-900 hover:bg-slate-100 shadow-md">
                Find Mentors
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="secondary" size="sm" icon={PlusCircle}>
                Add Skills
              </Button>
            </Link>
            <Link to="/availability">
              <Button variant="outline" size="sm" icon={Clock} className="border-indigo-400 text-white bg-transparent hover:bg-indigo-800/40">
                My Slots
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Upcoming Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:border-indigo-200 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Upcoming Sessions
            </span>
            <span className="text-2xl font-black text-slate-900">
              {upcomingSessions.length}
            </span>
            <Link to="/sessions" className="text-xs text-indigo-600 font-bold block mt-1 hover:underline">
              View schedule →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:border-indigo-200 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Pending Requests
            </span>
            <span className="text-2xl font-black text-slate-900">
              {pendingRequests.length}
            </span>
            <Link to="/requests" className="text-xs text-indigo-600 font-bold block mt-1 hover:underline">
              Review requests →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Skills Offered */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:border-indigo-200 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Skills Offered
            </span>
            <span className="text-2xl font-black text-slate-900">
              {user?.skills?.length || 0}
            </span>
            <Link to="/profile" className="text-xs text-indigo-600 font-bold block mt-1 hover:underline">
              Manage skills →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Average Rating */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:border-indigo-200 transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Mentor Rating
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-900">
                {user?.rating ? Number(user.rating).toFixed(1) : '5.0'}
              </span>
              <RatingStars rating={user?.rating || 5.0} size="sm" />
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {user?.sessionsCompleted || 0} sessions completed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-purple-100" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Upcoming/Requests, Right Profile Completion & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Sessions Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Peer Sessions
                </h2>
                <p className="text-xs text-slate-500">
                  Confirmed sessions scheduled at approved campus locations
                </p>
              </div>
              <Link to="/sessions">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  All Sessions
                </Button>
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingSessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    currentUserId={user?._id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No upcoming sessions</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                  Find a peer who knows what you want to learn and schedule a 1-on-1 session.
                </p>
                <Link to="/mentors">
                  <Button size="sm" icon={Compass}>
                    Find a Mentor
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Pending Mentorship Requests Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Incoming Mentorship Requests
                </h2>
                <p className="text-xs text-slate-500">
                  Fellow students asking to learn from your skills
                </p>
              </div>
              <Link to="/requests">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  Manage All
                </Button>
              </Link>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="received"
                    onAccept={async (id) => {
                      await requestService.acceptRequest(id);
                      setPendingRequests((prev) => prev.filter((r) => r._id !== id));
                    }}
                    onReject={async (id) => {
                      await requestService.rejectRequest(id);
                      setPendingRequests((prev) => prev.filter((r) => r._id !== id));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No pending incoming requests</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add more skills to your profile so other campus students can discover you!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Completion Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
              <span className="text-xs font-bold text-indigo-600">{completionPoints}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPoints}%` }}
              />
            </div>

            <ul className="space-y-2 text-xs text-slate-600 mb-5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>College email verified</span>
              </li>
              <li className="flex items-center gap-2">
                {user?.skills?.length ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span>Added skills you can teach ({user?.skills?.length || 0})</span>
              </li>
              <li className="flex items-center gap-2">
                {user?.interests?.length ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Specified skills you want to learn</span>
              </li>
            </ul>

            <Link to="/profile">
              <Button variant="outline" size="sm" className="w-full">
                Edit Student Profile
              </Button>
            </Link>
          </div>

          {/* Quick Notifications Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
              <Link to="/notifications" className="text-xs text-indigo-600 font-bold hover:underline">
                View all
              </Link>
            </div>

            {recentNotifications.length > 0 ? (
              <div className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div key={notif._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 line-clamp-1">{notif.title}</p>
                    <p className="text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
