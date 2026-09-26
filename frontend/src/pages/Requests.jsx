import React, { useState, useEffect } from 'react';
import { Inbox, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import requestService from '../services/requestService';
import RequestCard from '../components/RequestCard';
import Loading from '../components/Loading';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [received, sent] = await Promise.all([
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
      ]);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(true);
    try {
      await requestService.acceptRequest(id);
      setAlertMessage({ type: 'success', text: 'Mentorship request accepted! The learner can now book a time slot.' });
      fetchRequests();
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.response?.data?.message || 'Failed to accept request' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this mentorship request?')) return;
    setActionLoading(true);
    try {
      await requestService.rejectRequest(id);
      setAlertMessage({ type: 'success', text: 'Request declined.' });
      fetchRequests();
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.response?.data?.message || 'Failed to decline request' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your request?')) return;
    setActionLoading(true);
    try {
      await requestService.cancelRequest(id);
      setAlertMessage({ type: 'success', text: 'Request cancelled.' });
      fetchRequests();
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel request' });
    } finally {
      setActionLoading(false);
    }
  };

  const currentList = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#38BDF8] block mb-1">
          Peer Exchange Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          Mentorship Requests
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Manage incoming requests from peers and track requests you sent to mentors
        </p>
      </div>

      {/* Alert toast */}
      {alertMessage.text && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center justify-between text-sm ${
            alertMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-950/60 border border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertMessage({ type: '', text: '' })}
            className="text-xs font-bold underline hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-blue-500 text-[#60A5FA]'
              : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests (As Mentor)</span>
          {receivedRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-[#60A5FA] font-bold border border-blue-500/30">
              {receivedRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'sent'
              ? 'border-blue-500 text-[#60A5FA]'
              : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests (As Learner)</span>
          {sentRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-[#CBD5E1] font-bold border border-white/10">
              {sentRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Loading text="Loading mentorship requests..." />
      ) : currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              type={activeTab}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              loadingAction={actionLoading}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-[#080B18]/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <Inbox className="w-12 h-12 text-[#60A5FA]/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F8FAFC]">
            {activeTab === 'received' ? 'No incoming mentorship requests' : 'No requests sent yet'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When students discover your skills in the directory, their requests will appear here.'
              : 'Explore the skills directory or find a mentor to request 1-on-1 peer learning sessions.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Requests;
