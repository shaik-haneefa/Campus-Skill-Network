import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import sessionService from '../../services/sessionService';
import adminService from '../../services/adminService';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form, setForm] = useState({ name: '', building: '', description: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching campus locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setForm({ name: '', building: '', description: '', isActive: true });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (loc) => {
    setEditingLocation(loc);
    setForm({
      name: loc.name,
      building: loc.building,
      description: loc.description || '',
      isActive: loc.isActive,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.building.trim()) {
      setError('Location name and building are required');
      return;
    }

    setSaving(true);
    try {
      if (editingLocation) {
        await adminService.updateLocation(editingLocation._id, form);
      } else {
        await adminService.createLocation(form);
      }
      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving location');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campus meeting spot?')) return;
    try {
      await adminService.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting location');
    }
  };

  const handleToggleActive = async (loc) => {
    try {
      await adminService.updateLocation(loc._id, { isActive: !loc.isActive });
      fetchLocations();
    } catch (err) {
      alert('Error toggling location active state');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
            Safety & Infrastructure
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Approved Campus Locations
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Manage safe, supervised physical meeting zones for student peer sessions
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Campus Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <Sidebar isAdminPanel />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {loading ? (
              <Loading text="Loading meeting locations..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1024]/80 border-b border-white/10 text-[#94A3B8] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Zone Name</th>
                      <th className="px-6 py-4">Building</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {locations.map((loc) => (
                      <tr key={loc._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#F8FAFC] whitespace-nowrap">
                          {loc.name}
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#CBD5E1] whitespace-nowrap">
                          {loc.building}
                        </td>
                        <td className="px-6 py-4 max-w-sm truncate text-[#94A3B8]">
                          {loc.description || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(loc)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              loc.isActive
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                            }`}
                            title="Click to toggle"
                          >
                            {loc.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(loc)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] rounded-lg hover:bg-white/5 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(loc._id)}
                            className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLocation ? 'Edit Campus Location' : 'Add New Campus Location'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <Input
            label="Location Name"
            placeholder="e.g. Central Library — 2nd Floor Commons"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Building / Block"
            placeholder="e.g. Main Library, Science Block B"
            value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
              Description / Seating Guidelines
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Quiet zone with study desks, whiteboard, and power outlets..."
              className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-white/20 bg-[#0B1024] text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-semibold text-[#CBD5E1] cursor-pointer">
              Active location visible to students for scheduling
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={saving}
            >
              {editingLocation ? 'Save Changes' : 'Create Location'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageLocations;
