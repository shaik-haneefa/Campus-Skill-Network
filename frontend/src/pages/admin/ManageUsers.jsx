import React, { useState, useEffect } from 'react';
import { Search, Shield, User, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import adminService from '../../services/adminService';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({
        search: search || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId) => {
    setActionLoading(true);
    try {
      await adminService.toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async (userId) => {
    if (!window.confirm('Change this user\'s access privileges?')) return;
    setActionLoading(true);
    try {
      await adminService.toggleUserRole(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error changing role');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Administration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Manage Student Accounts
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Supervise registered campus members, roles, and account statuses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <Sidebar isAdminPanel />
        </div>

        <div className="lg:col-span-9 space-y-6">
          {/* Filter Bar */}
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
              <Input
                placeholder="Search students by name, email, ID, or department..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="md">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <span>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-white/10 py-1 px-3 bg-[#0B1024]/90 text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="All" className="bg-[#080B18]">All Roles</option>
                  <option value="student" className="bg-[#080B18]">Student</option>
                  <option value="admin" className="bg-[#080B18]">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Account Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 py-1 px-3 bg-[#0B1024]/90 text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="All" className="bg-[#080B18]">All Statuses</option>
                  <option value="active" className="bg-[#080B18]">Active</option>
                  <option value="inactive" className="bg-[#080B18]">Deactivated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {loading ? (
              <Loading text="Loading student list..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1024]/80 border-b border-white/10 text-[#94A3B8] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">ID & Department</th>
                      <th className="px-6 py-4">Skills Offered</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {u.profileImage ? (
                              <img
                                src={u.profileImage}
                                alt=""
                                className="w-9 h-9 rounded-xl object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                                {u.name ? u.name[0] : 'U'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-[#F8FAFC]">{u.name}</p>
                              <p className="text-[#94A3B8] text-[11px]">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-[#CBD5E1]">{u.studentId}</p>
                          <p className="text-[#94A3B8] text-[11px]">{u.department} • {u.year}</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {u.skills?.length ? (
                              u.skills.slice(0, 2).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-[#60A5FA] border border-blue-500/20"
                                >
                                  {sk.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[#94A3B8]/60 italic">None</span>
                            )}
                            {u.skills?.length > 2 && (
                              <span className="text-[10px] text-[#94A3B8]">
                                +{u.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-bold text-amber-400">
                          {u.rating ? Number(u.rating).toFixed(1) : '5.0'} ★ ({u.ratingsCount || 0})
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(u._id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors border ${
                              u.role === 'admin'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                                : 'bg-white/5 text-[#CBD5E1] border-white/10 hover:bg-white/10'
                            }`}
                            title="Click to toggle role"
                          >
                            {u.role}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              u.isActive
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u._id)}
                            disabled={actionLoading}
                            className={`font-semibold text-xs transition-colors ${
                              u.isActive
                                ? 'text-rose-400 hover:text-rose-300'
                                : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
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
    </div>
  );
};

export default ManageUsers;
