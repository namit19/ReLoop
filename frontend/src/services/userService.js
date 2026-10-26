import api from './api';

export const userService = {
  getUserProfile: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateProfile: async (formData) => {
    const res = await api.patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getMyProducts: async (status) => {
    const res = await api.get('/users/me/products', {
      params: status ? { status } : {},
    });
    return res.data;
  },

  getMyFavorites: async () => {
    const res = await api.get('/users/me/favorites');
    return res.data;
  },

  addFavorite: async (productId) => {
    const res = await api.post(`/users/me/favorites/${productId}`);
    return res.data;
  },

  removeFavorite: async (productId) => {
    const res = await api.delete(`/users/me/favorites/${productId}`);
    return res.data;
  },
};
