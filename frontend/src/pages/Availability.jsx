import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import sessionService from '../services/sessionService';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Availability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingSlot, setAddingSlot] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');

  const fetchSlots = async () => {
    try {
      const data = await sessionService.getAvailability();
      setSlots(data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!date || !startTime || !endTime) {
      setError('Date, start time, and end time are required');
      return;
    }

    setAddingSlot(true);
    try {
      await sessionService.addAvailability({ date, startTime, endTime });
      setSuccess('Availability slot added successfully!');
      fetchSlots();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add availability slot');
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this availability slot?')) return;
    try {
      await sessionService.deleteAvailability(id);
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
          Mentor Scheduling
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Your Availability
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set free time slots between classes when peers can schedule 1-on-1 sessions with you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Add Time Slot
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Specify when you are free on campus
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAddSlot} className="space-y-4">
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time"
                  placeholder="e.g. 10:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <Input
                  label="End Time"
                  placeholder="e.g. 11:00 AM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              {/* Campus tip */}
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2 text-xs text-indigo-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>We suggest 45–60 minute slots for focused peer learning.</span>
              </div>

              <Button
                type="submit"
                size="md"
                icon={Plus}
                isLoading={addingSlot}
                className="w-full mt-2"
              >
                Add Availability Slot
              </Button>
            </form>
          </div>
        </div>

        {/* Current Slots List (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Your Scheduled Slots ({slots.length})
              </h2>
            </div>

            {loading ? (
              <Loading text="Loading your slots..." />
            ) : slots.length > 0 ? (
              <div className="space-y-3">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{slot.date}</span>
                          {slot.isBooked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Booked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Open
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.startTime} – {slot.endTime}</span>
                        </div>
                      </div>
                    </div>

                    {!slot.isBooked && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No slots defined yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Add dates and hours using the form on the left to let peers book sessions with you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
