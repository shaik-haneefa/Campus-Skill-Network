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
        <h2 className="text-xl font-bold text-slate-800">Mentorship Request Not Found</h2>
        <Link to="/requests" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Requests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </Link>

      <div className="mb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
          Confirmed Mentorship Match
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Schedule Session with {request.mentor?.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pick one of your mentor's open time slots and select an approved safe campus meeting spot
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        {/* Mentor & Skill banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {request.mentor?.profileImage ? (
              <img
                src={request.mentor.profileImage}
                alt={request.mentor.name}
                className="w-12 h-12 rounded-xl object-cover border border-indigo-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                {request.mentor?.name ? request.mentor.name[0] : 'M'}
              </div>
            )}
            <div>
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Mentor</p>
              <h3 className="text-sm font-bold text-slate-900">{request.mentor?.name}</h3>
              <p className="text-xs text-slate-500">{request.mentor?.department}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block mb-0.5">Skill</span>
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-white text-indigo-700 shadow-xs border border-indigo-100">
              {request.skill}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Time slot selection */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              1. Choose a Meeting Time Slot
            </label>

            {slots.length > 0 ? (
              <div className="space-y-2 mb-3">
                {slots.map((slot) => (
                  <label
                    key={slot._id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedSlotId === slot._id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="slotOption"
                        checked={selectedSlotId === slot._id}
                        onChange={() => setSelectedSlotId(slot._id)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">{slot.date}</span>
                        <span className="text-slate-500">{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      Open Slot
                    </span>
                  </label>
                ))}

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedSlotId === 'custom'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="slotOption"
                    checked={selectedSlotId === 'custom'}
                    onChange={() => setSelectedSlotId('custom')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Propose Custom Date & Time
                  </span>
                </label>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mb-3 italic">
                Mentor has not published predefined slots yet. Please specify your agreed date and time:
              </p>
            )}

            {(selectedSlotId === 'custom' || slots.length === 0) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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
              <label className="block text-sm font-bold text-slate-800">
                2. Select an Approved Campus Meeting Location
              </label>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
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
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="locationOption"
                    checked={selectedLocation === loc.name}
                    onChange={() => setSelectedLocation(loc.name)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs flex-1">
                    <span className="font-bold text-slate-900 block">{loc.name}</span>
                    <span className="text-slate-500">{loc.building} — {loc.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Preparation Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              3. Preparation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. I will bring my laptop and problem sheet..."
              className="block w-full rounded-xl border border-slate-200 text-sm py-2 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
