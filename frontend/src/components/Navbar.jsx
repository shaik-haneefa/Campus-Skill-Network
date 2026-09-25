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
    `text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
                Campus<span className="text-indigo-600">Skill</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
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
                  <Sparkles className="w-4 h-4" />
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
                    <Shield className="w-4 h-4 text-amber-500" />
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
                <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1.5 px-3">
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
                  className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition-colors"
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
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {user?.name ? user.name[0] : 'U'}
                      </div>
                    )}
                    <div className="text-left text-xs">
                      <span className="font-bold text-slate-800 block truncate max-w-[110px]">
                        {user?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/availability"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          Set Availability
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded-xl"
                          >
                            <Shield className="w-4 h-4 text-amber-500" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
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
                className="relative p-2 text-slate-600 hover:text-indigo-600"
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
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="pb-3 mb-2 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.department}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Dashboard
              </Link>
              <Link
                to="/mentors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Explore Mentors
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                All Skills
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Mentorship Requests
              </Link>
              <Link
                to="/sessions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                My Sessions
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                My Profile
              </Link>
              <Link
                to="/availability"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Set Availability
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-xl"
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-rose-600"
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
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Home
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Explore Skills
              </Link>
              <Link
                to="/mentors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Find Mentors
              </Link>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
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
