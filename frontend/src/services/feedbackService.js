import api from './api';

export const feedbackService = {
  async submitFeedback(data) {
    const res = await api.post('/feedback', data);
    return res.data;
  },

  async getMentorFeedback(mentorId) {
    const res = await api.get(`/feedback/${mentorId}`);
    return res.data;
  },
};

export default feedbackService;
