import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import Skills from '../pages/Skills';
import MentorSearch from '../pages/MentorSearch';
import MentorProfile from '../pages/MentorProfile';

// Protected pages
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Requests from '../pages/Requests';
import Availability from '../pages/Availability';
import ScheduleSession from '../pages/ScheduleSession';
import Sessions from '../pages/Sessions';
import Chat from '../pages/Chat';
import Notifications from '../pages/Notifications';
import Feedback from '../pages/Feedback';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageSkills from '../pages/admin/ManageSkills';
import ManageLocations from '../pages/admin/ManageLocations';
import ManageReports from '../pages/admin/ManageReports';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/mentors" element={<MentorSearch />} />
      <Route path="/mentor/:id" element={<MentorProfile />} />

      {/* Protected Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule/:requestId"
        element={
          <ProtectedRoute>
            <ScheduleSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback/:sessionId"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <AdminRoute>
            <ManageSkills />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <AdminRoute>
            <ManageLocations />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <ManageReports />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
