import api from './api';

export const userService = {
  async getUsers(params = {}) {
    const res = await api.get('/users', { params });
    return res.data;
  },

  async getUserById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },

  async addSkill(skillData) {
    const res = await api.post('/users/skills', skillData);
    return res.data;
  },

  async removeSkill(skillName) {
    const res = await api.delete(`/users/skills/${encodeURIComponent(skillName)}`);
    return res.data;
  },

  async updateInterests(interests) {
    const res = await api.put('/users/interests', { interests });
    return res.data;
  },
};

export default userService;
