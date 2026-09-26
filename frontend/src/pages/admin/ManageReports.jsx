import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Sparkles, Calendar, CheckCircle2, Clock, Star, Award, Shield } from 'lucide-react';
import adminService from '../../services/adminService';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

const ManageReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getReports();
        setStats(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading text="Generating campus analytics report..." />;
  }

  const completionRate = stats?.totalSessions
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
            Impact & Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Campus Mentorship Reports
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Detailed learning metrics, session completion rates, and student engagement statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <Sidebar isAdminPanel />
        </div>

        <div className="lg:col-span-9 space-y-8">
          {/* Main Visual Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0B1024]/90 backdrop-blur-xl border border-blue-500/20 text-[#F8FAFC] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA] block mb-1">
                Completion Rate
              </span>
              <span className="text-4xl font-extrabold">{completionRate}%</span>
              <p className="text-xs text-[#94A3B8] mt-2">
                {stats?.completedSessions} of {stats?.totalSessions} scheduled sessions successfully completed
              </p>
            </div>

            <div className="bg-[#0B1024]/90 backdrop-blur-xl border border-emerald-500/20 text-[#F8FAFC] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-600/20 rounded-full blur-2xl" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Peer Satisfaction
              </span>
              <span className="text-4xl font-extrabold">{stats?.averageRating || 5.0} ★</span>
              <p className="text-xs text-[#94A3B8] mt-2">
                Average mentor score across all campus departments
              </p>
            </div>

            <div className="bg-[#0B1024]/90 backdrop-blur-xl border border-purple-500/20 text-[#F8FAFC] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] block mb-1">
                Active Student Ratio
              </span>
              <span className="text-4xl font-extrabold">
                {stats?.totalStudents ? Math.round((stats.totalMentors / stats.totalStudents) * 100) : 0}%
              </span>
              <p className="text-xs text-[#94A3B8] mt-2">
                {stats?.totalMentors} out of {stats?.totalStudents} students offering peer mentoring
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-4">
              Comprehensive Platform Metrics
            </h2>

            <div className="divide-y divide-white/5 text-sm">
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Total Registered Students</span>
                <span className="font-extrabold text-[#F8FAFC]">{stats?.totalStudents}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Active Peer Mentors</span>
                <span className="font-extrabold text-[#F8FAFC]">{stats?.totalMentors}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Unique Skills Cataloged</span>
                <span className="font-extrabold text-[#F8FAFC]">{stats?.totalSkills}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Total Sessions Booked</span>
                <span className="font-extrabold text-[#F8FAFC]">{stats?.totalSessions}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Completed Mentorship Sessions</span>
                <span className="font-extrabold text-emerald-400">{stats?.completedSessions}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Pending Requests In Queue</span>
                <span className="font-extrabold text-amber-400">{stats?.pendingRequests}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#94A3B8] font-medium">Approved Physical Campus Meeting Zones</span>
                <span className="font-extrabold text-[#F8FAFC]">{stats?.totalLocations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReports;
