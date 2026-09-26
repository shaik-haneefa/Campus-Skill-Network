import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, ArrowLeft, Shield, FileText } from 'lucide-react';
import requestService from '../services/requestService';
import sessionService from '../services/sessionService';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const ScheduleSession = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customStartTime, setCustomStartTime] = useState('10:00 AM');
  const [customEndTime, setCustomEndTime] = useState('11:00 AM');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sentReqs, locsData] = await Promise.all([
          requestService.getSentRequests(),
          sessionService.getLocations(),
        ]);

        const targetReq = sentReqs.find((r) => r._id === requestId);
        setRequest(targetReq);
        setLocations(locsData);

        if (locsData.length > 0) {
          setSelectedLocation(locsData[0].name);
        }

        if (targetReq?.mentor?._id) {
          const mentorSlots = await sessionService.getAvailability(targetReq.mentor._id, true);
          setSlots(mentorSlots);
          if (mentorSlots.length > 0) {
            setSelectedSlotId(mentorSlots[0]._id);
          } else if (targetReq.preferredDate) {
            setCustomDate(targetReq.preferredDate);
          }
        }
      } catch (err) {
        console.error('Error preparing session schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedLocation) {
      setError('Please select an approved campus meeting location.');
      return;
    }

    if (!selectedSlotId && (!customDate || !customStartTime || !customEndTime)) {
      setError('Please select or specify a session date and time.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        mentorshipRequestId: request._id,
        location: selectedLocation,
        notes,
      };

      if (selectedSlotId && selectedSlotId !== 'custom') {
        payload.slotId = selectedSlotId;
      } else {
        payload.date = customDate;
        payload.startTime = customStartTime;
        payload.endTime = customEndTime;
      }

      await sessionService.createSession(payload);
      setSuccess('Session scheduled successfully! Redirecting to sessions...');
      setTimeout(() => {
        navigate('/sessions');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading mentorship request & mentor schedule..." />;
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-[#F8FAFC]">Mentorship Request Not Found</h2>
        <Link to="/requests" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Requests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <Link
        to="/requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#60A5FA] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </Link>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#38BDF8] block mb-1">
          Confirmed Mentorship Match
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Schedule Session with {request.mentor?.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Pick one of your mentor's open time slots and select an approved safe campus meeting spot
        </p>
      </div>

      <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mentor & Skill banner */}
        <div className="p-4 rounded-2xl bg-[#0B1024]/90 border border-white/10 flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {request.mentor?.profileImage ? (
              <img
                src={request.mentor.profileImage}
                alt={request.mentor.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {request.mentor?.name ? request.mentor.name[0] : 'M'}
              </div>
            )}
            <div>
              <p className="text-xs text-[#60A5FA] font-semibold uppercase tracking-wider">Mentor</p>
              <h3 className="text-sm font-bold text-[#F8FAFC]">{request.mentor?.name}</h3>
              <p className="text-xs text-[#94A3B8]">{request.mentor?.department}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#94A3B8] block mb-0.5">Skill</span>
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-500/15 text-[#60A5FA] shadow-xs border border-blue-500/25">
              {request.skill}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Step 1: Time slot selection */}
          <div>
            <label className="block text-sm font-bold text-[#F8FAFC] mb-2">
              1. Choose a Meeting Time Slot
            </label>

            {slots.length > 0 ? (
              <div className="space-y-2 mb-3">
                {slots.map((slot) => (
                  <label
                    key={slot._id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedSlotId === slot._id
                        ? 'border-blue-500 bg-blue-500/10 shadow-xs ring-1 ring-blue-500'
                        : 'border-white/10 bg-[#0B1024]/60 hover:bg-[#0B1024]/90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="slotOption"
                        checked={selectedSlotId === slot._id}
                        onChange={() => setSelectedSlotId(slot._id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#F8FAFC] block">{slot.date}</span>
                        <span className="text-[#94A3B8]">{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Open Slot
                    </span>
                  </label>
                ))}

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedSlotId === 'custom'
                      ? 'border-blue-500 bg-blue-500/10 shadow-xs'
                      : 'border-white/10 bg-[#0B1024]/60 hover:bg-[#0B1024]/90'
                  }`}
                >
                  <input
                    type="radio"
                    name="slotOption"
                    checked={selectedSlotId === 'custom'}
                    onChange={() => setSelectedSlotId('custom')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-[#CBD5E1]">
                    Propose Custom Date & Time
                  </span>
                </label>
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] mb-3 italic">
                Mentor has not published predefined slots yet. Please specify your agreed date and time:
              </p>
            )}

            {(selectedSlotId === 'custom' || slots.length === 0) && (
              <div className="p-4 rounded-2xl bg-[#0B1024]/80 border border-white/10 space-y-3">
                <Input
                  label="Session Date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Time"
                    placeholder="e.g. 10:00 AM"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    required
                  />
                  <Input
                    label="End Time"
                    placeholder="e.g. 11:00 AM"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Approved Campus Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-[#F8FAFC]">
                2. Select an Approved Campus Meeting Location
              </label>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Safe Zones</span>
              </div>
            </div>

            <div className="space-y-2">
              {locations.map((loc) => (
                <label
                  key={loc._id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedLocation === loc.name
                      ? 'border-blue-500 bg-blue-500/10 shadow-xs ring-1 ring-blue-500'
                      : 'border-white/10 bg-[#0B1024]/60 hover:bg-[#0B1024]/90'
                  }`}
                >
                  <input
                    type="radio"
                    name="locationOption"
                    checked={selectedLocation === loc.name}
                    onChange={() => setSelectedLocation(loc.name)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs flex-1">
                    <span className="font-bold text-[#F8FAFC] block">{loc.name}</span>
                    <span className="text-[#94A3B8]">{loc.building} — {loc.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Preparation Notes */}
          <div>
            <label className="block text-sm font-bold text-[#F8FAFC] mb-1.5">
              3. Preparation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. I will bring my laptop and problem sheet..."
              className="block w-full rounded-xl border border-white/10 text-sm py-2 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link to="/requests">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="md"
              icon={CheckCircle2}
              isLoading={submitting}
            >
              Confirm & Schedule Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSession;
