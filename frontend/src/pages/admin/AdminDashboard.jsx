import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import adminService from '../../services/adminService';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getReports();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading text="Loading campus administration analytics..." />;
  }

  const statCards = [
    { label: 'Total Registered Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Active Student Mentors', value: stats?.totalMentors || 0, icon: Sparkles, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { label: 'Skills in Catalog', value: stats?.totalSkills || 0, icon: TrendingUp, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { label: 'Total Scheduled Sessions', value: stats?.totalSessions || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Completed Peer Sessions', value: stats?.completedSessions || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Pending Mentorship Requests', value: stats?.pendingRequests || 0, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Approved Campus Locations', value: stats?.totalLocations || 0, icon: MapPin, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Average Peer Rating', value: `${stats?.averageRating || 5.0} ★`, icon: Star, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Campus Admin Console
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Campus-wide supervision, student management, skills moderation, and safe meeting hubs
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users">
            <Button size="sm" variant="outline">
              Manage Students
            </Button>
          </Link>
          <Link to="/admin/skills">
            <Button size="sm" variant="outline">
              Manage Skills
            </Button>
          </Link>
          <Link to="/admin/locations">
            <Button size="sm" variant="primary">
              Campus Locations
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3">
          <Sidebar isAdminPanel />
        </div>

        {/* Right Main Analytics Content (9 cols) */}
        <div className="lg:col-span-9 space-y-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {card.label}
                    </span>
                    <div className={`p-2 rounded-xl border ${card.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    {card.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Tables: Recent Registrations & Recent Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Recent Student Registrations
                </h3>
                <Link to="/admin/users" className="text-xs text-indigo-600 font-bold hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.recentUsers?.map((u) => (
                  <div key={u._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-slate-400">{u.department} • {u.year}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 capitalize">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Recent Campus Sessions
                </h3>
                <Link to="/admin/reports" className="text-xs text-indigo-600 font-bold hover:underline">
                  Full reports
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.recentSessions?.length ? (
                  stats.recentSessions.map((s) => (
                    <div key={s._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{s.skill}</p>
                        <p className="text-slate-400">{s.learner?.name} & {s.mentor?.name}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        s.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No recent sessions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
