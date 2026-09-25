import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('csn_token', res.data.token);
      localStorage.setItem('csn_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('csn_token', res.data.token);
      localStorage.setItem('csn_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async verifyEmail(data) {
    const res = await api.post('/auth/verify-email', data);
    return res.data;
  },

  async forgotPassword(data) {
    const res = await api.post('/auth/forgot-password', data);
    return res.data;
  },

  logout() {
    localStorage.removeItem('csn_token');
    localStorage.removeItem('csn_user');
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('csn_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

export default authService;
