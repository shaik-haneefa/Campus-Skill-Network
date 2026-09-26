import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Compass,
  Calendar,
  Inbox,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, unreadNotifications } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-all duration-150 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
      isActive
        ? 'text-[#F8FAFC] bg-blue-600/15 border border-blue-500/25 font-semibold shadow-sm'
        : 'text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-white/[0.05]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[rgba(15,18,35,0.75)] backdrop-blur-[18px] border-b border-white/10 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform border border-white/15">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#F8FAFC] tracking-tight block leading-tight">
                Campus<span className="text-[#38BDF8]">Skill</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>
                <NavLink to="/mentors" className={navLinkClasses}>
                  <Compass className="w-4 h-4" />
                  Explore Mentors
                </NavLink>
                <NavLink to="/skills" className={navLinkClasses}>
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  Skills
                </NavLink>
                <NavLink to="/requests" className={navLinkClasses}>
                  <Inbox className="w-4 h-4" />
                  Requests
                </NavLink>
                <NavLink to="/sessions" className={navLinkClasses}>
                  <Calendar className="w-4 h-4" />
                  Sessions
                </NavLink>
                <NavLink to="/chat" className={navLinkClasses}>
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClasses}>
                    <Shield className="w-4 h-4 text-purple-400" />
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/" className={navLinkClasses}>
                  Home
                </NavLink>
                <NavLink to="/skills" className={navLinkClasses}>
                  Explore Skills
                </NavLink>
                <NavLink to="/mentors" className={navLinkClasses}>
                  Find Mentors
                </NavLink>
                <a
                  href="/#how-it-works"
                  className="text-sm font-medium text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-white/[0.05] py-1.5 px-3 rounded-xl transition-colors"
                >
                  How It Works
                </a>
              </>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-white/[0.05] rounded-xl transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.05] transition-colors focus:outline-none border border-transparent hover:border-white/10"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/15"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {user?.name ? user.name[0] : 'U'}
                      </div>
                    )}
                    <div className="text-left text-xs">
                      <span className="font-bold text-[#F8FAFC] block truncate max-w-[110px]">
                        {user?.name}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#080B18]/95 backdrop-blur-2xl p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-xs font-bold text-[#F8FAFC] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#60A5FA]" />
                          My Profile
                        </Link>
                        <Link
                          to="/availability"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        >
                          <Clock className="w-4 h-4 text-[#38BDF8]" />
                          Set Availability
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#A78BFA] hover:bg-purple-500/10 rounded-xl transition-colors"
                          >
                            <Shield className="w-4 h-4 text-[#7C3AED]" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!text-[#CBD5E1] hover:!text-[#60A5FA] hover:!bg-white/[0.05]"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="!bg-gradient-to-r !from-blue-600 !to-blue-500 hover:!from-blue-500 hover:!to-blue-400 !text-white shadow-md shadow-blue-500/25 !border-0 font-bold"
                  >
                    Join Network
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 text-[#CBD5E1] hover:text-[#60A5FA]"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                )}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#CBD5E1] hover:bg-white/[0.06] rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080B18]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="pb-3 mb-2 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">{user?.name}</p>
                  <p className="text-xs text-[#94A3B8]">{user?.department}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Dashboard
              </Link>
              <Link
                to="/mentors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Explore Mentors
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                All Skills
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Mentorship Requests
              </Link>
              <Link
                to="/sessions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                My Sessions
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                My Profile
              </Link>
              <Link
                to="/availability"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Set Availability
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#A78BFA] bg-purple-500/10 rounded-xl"
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-2 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-rose-400 !border-rose-500/20 hover:!bg-rose-500/10"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Home
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Explore Skills
              </Link>
              <Link
                to="/mentors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/[0.05] rounded-xl"
              >
                Find Mentors
              </Link>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full !bg-gradient-to-r !from-blue-600 !to-blue-500 text-white font-bold">
                    Join Network
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
