import api from './api';

export const chatService = {
  async getConversations() {
    const res = await api.get('/messages/conversations');
    return res.data;
  },

  async getMessages(conversationId) {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data;
  },

  async sendMessage(data) {
    const res = await api.post('/messages', data);
    return res.data;
  },
};

export default chatService;
