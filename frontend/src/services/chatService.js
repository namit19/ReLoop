import api from './api';

export const chatService = {
  getConversations: async () => {
    const res = await api.get('/conversations');
    return res.data;
  },

  getOrCreateConversation: async (productId) => {
    const res = await api.post('/conversations', { productId });
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId, text) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { text });
    return res.data;
  },
};
