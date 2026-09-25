import api from './api';

export const sessionService = {
  async createSession(sessionData) {
    const res = await api.post('/sessions', sessionData);
    return res.data;
  },

  async getSessions(params = {}) {
    const res = await api.get('/sessions', { params });
    return res.data;
  },

  async getSessionById(id) {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  },

  async completeSession(id) {
    const res = await api.put(`/sessions/${id}/complete`);
    return res.data;
  },

  async cancelSession(id) {
    const res = await api.put(`/sessions/${id}/cancel`);
    return res.data;
  },

  // Availability
  async getAvailability(mentorId, availableOnly = false) {
    const endpoint = mentorId ? `/availability/${mentorId}` : '/availability';
    const res = await api.get(endpoint, { params: { availableOnly } });
    return res.data;
  },

  async addAvailability(slotData) {
    const res = await api.post('/availability', slotData);
    return res.data;
  },

  async deleteAvailability(slotId) {
    const res = await api.delete(`/availability/${slotId}`);
    return res.data;
  },

  // Locations
  async getLocations() {
    const res = await api.get('/locations');
    return res.data;
  },
};

export default sessionService;
