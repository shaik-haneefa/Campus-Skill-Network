import api from './api';

export const requestService = {
  async sendRequest(data) {
    const res = await api.post('/requests', data);
    return res.data;
  },

  async getSentRequests() {
    const res = await api.get('/requests/sent');
    return res.data;
  },

  async getReceivedRequests() {
    const res = await api.get('/requests/received');
    return res.data;
  },

  async acceptRequest(id) {
    const res = await api.put(`/requests/${id}/accept`);
    return res.data;
  },

  async rejectRequest(id) {
    const res = await api.put(`/requests/${id}/reject`);
    return res.data;
  },

  async cancelRequest(id) {
    const res = await api.put(`/requests/${id}/cancel`);
    return res.data;
  },
};

export default requestService;
