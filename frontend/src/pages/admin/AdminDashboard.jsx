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
    { label: 'Total Registered Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-[#60A5FA] bg-blue-500/10 border-blue-500/20' },
    { label: 'Active Student Mentors', value: stats?.totalMentors || 0, icon: Sparkles, color: 'text-[#A78BFA] bg-purple-500/10 border-purple-500/20' },
    { label: 'Skills in Catalog', value: stats?.totalSkills || 0, icon: TrendingUp, color: 'text-[#38BDF8] bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Total Scheduled Sessions', value: stats?.totalSessions || 0, icon: Calendar, color: 'text-[#60A5FA] bg-blue-500/10 border-blue-500/20' },
    { label: 'Completed Peer Sessions', value: stats?.completedSessions || 0, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Pending Mentorship Requests', value: stats?.pendingRequests || 0, icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Approved Campus Locations', value: stats?.totalLocations || 0, icon: MapPin, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { label: 'Average Peer Rating', value: `${stats?.averageRating || 5.0} ★`, icon: Star, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Campus Admin Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
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
                  className="bg-[#080B18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl hover:border-blue-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#94A3B8]">
                      {card.label}
                    </span>
                    <div className={`p-2 rounded-xl border ${card.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#F8FAFC]">
                    {card.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Tables: Recent Registrations & Recent Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Recent Student Registrations
                </h3>
                <Link to="/admin/users" className="text-xs text-[#60A5FA] font-bold hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.recentUsers?.map((u) => (
                  <div key={u._id} className="p-3 rounded-xl bg-[#0B1024]/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#F8FAFC]">{u.name}</p>
                      <p className="text-[#94A3B8]">{u.department} • {u.year}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-[#60A5FA] border border-blue-500/20 capitalize">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Recent Campus Sessions
                </h3>
                <Link to="/admin/reports" className="text-xs text-[#60A5FA] font-bold hover:underline">
                  Full reports
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.recentSessions?.length ? (
                  stats.recentSessions.map((s) => (
                    <div key={s._id} className="p-3 rounded-xl bg-[#0B1024]/70 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#F8FAFC]">{s.skill}</p>
                        <p className="text-[#94A3B8]">{s.learner?.name} & {s.mentor?.name}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                        s.status === 'completed'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : s.status === 'cancelled'
                          ? 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          : 'bg-blue-950/60 text-[#60A5FA] border-blue-500/30'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#94A3B8] text-center py-6">No recent sessions</p>
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
