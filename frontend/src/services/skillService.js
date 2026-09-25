import api from './api';

export const skillService = {
  async getSkills(params = {}) {
    const res = await api.get('/skills', { params });
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/skills/categories');
    return res.data;
  },

  async createSkill(data) {
    const res = await api.post('/skills', data);
    return res.data;
  },

  async updateSkill(id, data) {
    const res = await api.put(`/skills/${id}`, data);
    return res.data;
  },

  async deleteSkill(id) {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },
};

export default skillService;
