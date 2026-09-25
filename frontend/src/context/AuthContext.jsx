import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('csn_token') || null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('csn_token');
      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setToken(storedToken);
        } catch (err) {
          console.error('Session validation error:', err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Initialize socket when user is logged in
  useEffect(() => {
    if (!user || !user._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect socket
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('registerUser', user._id);
    });

    newSocket.on('onlineUsersList', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('newNotification', (notif) => {
      setUnreadNotifications((prev) => prev + 1);
    });

    setSocket(newSocket);

    // Fetch initial notification badge count
    notificationService
      .getNotifications()
      .then((data) => {
        setUnreadNotifications(data.unreadCount || 0);
      })
      .catch(() => {});

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setUser(null);
    setToken(null);
    setOnlineUsers([]);
    setUnreadNotifications(0);
  };

  const refreshUser = async () => {
    try {
      const updated = await authService.getCurrentUser();
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        socket,
        onlineUsers,
        unreadNotifications,
        setUnreadNotifications,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
