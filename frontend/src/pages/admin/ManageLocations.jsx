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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 block mb-1">
            Safety & Infrastructure
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Approved Campus Locations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
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
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
            {loading ? (
              <Loading text="Loading meeting locations..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Zone Name</th>
                      <th className="px-6 py-4">Building</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {locations.map((loc) => (
                      <tr key={loc._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                          {loc.name}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600 whitespace-nowrap">
                          {loc.building}
                        </td>
                        <td className="px-6 py-4 max-w-sm truncate text-slate-500">
                          {loc.description || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(loc)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              loc.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
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
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(loc._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description / Seating Guidelines
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Quiet zone with study desks, whiteboard, and power outlets..."
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Active location visible to students for scheduling
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
