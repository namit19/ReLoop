import api from './api';

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('reloop_token', res.data.token);
    }
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('reloop_token', res.data.token);
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('reloop_token');
    }
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
