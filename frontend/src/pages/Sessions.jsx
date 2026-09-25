import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Ban, Check, MessageSquare, Star } from 'lucide-react';
import sessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import Loading from '../components/Loading';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('scheduled'); // 'scheduled', 'completed', 'cancelled'
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { user } = useAuth();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleComplete = async (sessionId) => {
    if (!window.confirm('Mark this peer mentorship session as completed?')) return;
    setActionLoading(true);
    try {
      await sessionService.completeSession(sessionId);
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled session?')) return;
    setActionLoading(true);
    try {
      await sessionService.cancelSession(sessionId);
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel session');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) => s.status === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
          Peer Learning Calendar
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Mentorship Sessions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your scheduled, past, and cancelled 1-on-1 study sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('scheduled')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'scheduled'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 font-bold">
            {sessions.filter((s) => s.status === 'scheduled').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 font-bold">
            {sessions.filter((s) => s.status === 'completed').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'cancelled'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Cancelled</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-bold">
            {sessions.filter((s) => s.status === 'cancelled').length}
          </span>
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <Loading text="Loading your sessions..." />
      ) : filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              currentUserId={user?._id}
              onComplete={handleComplete}
              onCancel={handleCancel}
              loadingAction={actionLoading}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-8 shadow-card">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No {activeTab} sessions found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'scheduled'
              ? 'You have no pending sessions on your calendar. Request a mentor or accept pending requests to get started.'
              : `You have no ${activeTab} sessions recorded.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sessions;
