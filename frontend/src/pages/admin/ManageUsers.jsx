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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Administration
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Student Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
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

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 py-1 px-2.5 bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Account Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 py-1 px-2.5 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Deactivated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
            {loading ? (
              <Loading text="Loading student list..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
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
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {u.profileImage ? (
                              <img
                                src={u.profileImage}
                                alt=""
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                                {u.name ? u.name[0] : 'U'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-slate-400 text-[11px]">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-800">{u.studentId}</p>
                          <p className="text-slate-500 text-[11px]">{u.department} • {u.year}</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {u.skills?.length ? (
                              u.skills.slice(0, 2).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700"
                                >
                                  {sk.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                            {u.skills?.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{u.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700">
                          {u.rating ? Number(u.rating).toFixed(1) : '5.0'} ★ ({u.ratingsCount || 0})
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(u._id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Click to toggle role"
                          >
                            {u.role}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              u.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
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
                                ? 'text-rose-600 hover:text-rose-800'
                                : 'text-emerald-600 hover:text-emerald-800'
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
