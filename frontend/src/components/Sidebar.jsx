import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Inbox,
  Calendar,
  Clock,
  MessageSquare,
  User,
  Shield,
  Sparkles,
  MapPin,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isAdminPanel = false }) => {
  const { user, isAdmin } = useAuth();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-blue-600/15 text-[#60A5FA] border border-blue-500/30 font-bold shadow-sm'
        : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-white/[0.05]'
    }`;

  const adminLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-purple-600/15 text-[#A78BFA] border border-purple-500/30 font-bold shadow-sm'
        : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-white/[0.05]'
    }`;

  if (isAdminPanel) {
    return (
      <aside className="w-full md:w-64 bg-[#080B18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl h-fit space-y-1">
        <div className="px-3.5 py-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-[#A78BFA] font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-[#7C3AED]" />
            Admin Console
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">Platform Administration</p>
        </div>

        <NavLink to="/admin" end className={adminLinkClasses}>
          <BarChart3 className="w-4 h-4" />
          Analytics & Reports
        </NavLink>
        <NavLink to="/admin/users" className={adminLinkClasses}>
          <Users className="w-4 h-4" />
          Manage Students
        </NavLink>
        <NavLink to="/admin/skills" className={adminLinkClasses}>
          <Sparkles className="w-4 h-4" />
          Manage Skills
        </NavLink>
        <NavLink to="/admin/locations" className={adminLinkClasses}>
          <MapPin className="w-4 h-4" />
          Campus Locations
        </NavLink>

        <div className="pt-3 mt-3 border-t border-white/10">
          <NavLink to="/dashboard" className={linkClasses}>
            <LayoutDashboard className="w-4 h-4" />
            Back to Student App
          </NavLink>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-64 bg-[#080B18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl h-fit space-y-1">
      <div className="px-3.5 py-2 mb-2 border-b border-white/10 flex items-center gap-3">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border border-white/15"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
            {user?.name ? user.name[0] : 'U'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#F8FAFC] truncate">{user?.name}</p>
          <p className="text-xs text-[#94A3B8] truncate">{user?.department}</p>
        </div>
      </div>

      <NavLink to="/dashboard" className={linkClasses}>
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </NavLink>

      <NavLink to="/profile" className={linkClasses}>
        <User className="w-4 h-4" />
        My Profile
      </NavLink>

      <NavLink to="/mentors" className={linkClasses}>
        <Compass className="w-4 h-4" />
        Explore Mentors
      </NavLink>

      <NavLink to="/skills" className={linkClasses}>
        <Sparkles className="w-4 h-4" />
        Skills Directory
      </NavLink>

      <NavLink to="/requests" className={linkClasses}>
        <Inbox className="w-4 h-4" />
        Mentorship Requests
      </NavLink>

      <NavLink to="/sessions" className={linkClasses}>
        <Calendar className="w-4 h-4" />
        My Sessions
      </NavLink>

      <NavLink to="/availability" className={linkClasses}>
        <Clock className="w-4 h-4" />
        My Availability
      </NavLink>

      <NavLink to="/chat" className={linkClasses}>
        <MessageSquare className="w-4 h-4" />
        Messages
      </NavLink>

      {isAdmin && (
        <div className="pt-2 mt-2 border-t border-white/10">
          <NavLink to="/admin" className={adminLinkClasses}>
            <Shield className="w-4 h-4 text-[#7C3AED]" />
            Admin Panel
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
