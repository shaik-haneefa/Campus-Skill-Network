import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Building, FileText, Image, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Input from '../components/Input';
import Button from '../components/Button';

const departmentsList = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & AI',
  'Business Administration (MBA)',
  'Physics & Applied Sciences',
  'Design & Architecture',
  'Other Department',
];

const yearsList = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '2nd Year',
    college: user?.college || 'Campus University of Technology',
    profileImage: user?.profileImage || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.updateProfile(formData);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Student Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep your campus information and bio up to date for peers
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {yearsList.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="College / Institution"
            name="college"
            value={formData.college}
            onChange={handleChange}
            icon={Building}
          />

          <Input
            label="Profile Picture URL (Optional)"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://... (Unsplash or image link)"
            icon={Image}
            helperText="Paste any direct web image URL to customize your avatar"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Bio / Introduction
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your college peers what you love doing, learning, or teaching..."
              className="block w-full rounded-xl border border-slate-200 text-sm py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              icon={Save}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
