import api from './api';

export const adminService = {
  async getReports() {
    const res = await api.get('/admin/reports');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async toggleUserStatus(userId) {
    const res = await api.put(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  async toggleUserRole(userId) {
    const res = await api.put(`/admin/users/${userId}/toggle-role`);
    return res.data;
  },

  async createLocation(locationData) {
    const res = await api.post('/admin/locations', locationData);
    return res.data;
  },

  async updateLocation(id, locationData) {
    const res = await api.put(`/admin/locations/${id}`, locationData);
    return res.data;
  },

  async deleteLocation(id) {
    const res = await api.delete(`/admin/locations/${id}`);
    return res.data;
  },
};

export default adminService;
