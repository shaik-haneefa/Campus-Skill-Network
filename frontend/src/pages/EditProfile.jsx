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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#60A5FA] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Edit Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Keep your campus information and bio up to date for peers
        </p>
      </div>

      <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#080B18] text-[#F8FAFC]">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {yearsList.map((yr) => (
                  <option key={yr} value={yr} className="bg-[#080B18] text-[#F8FAFC]">
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
            <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 uppercase tracking-wider">
              Bio / Introduction
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your college peers what you love doing, learning, or teaching..."
              className="block w-full rounded-xl border border-white/10 text-sm py-2.5 px-3.5 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
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
