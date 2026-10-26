import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (formData) => {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await api.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  updateProductStatus: async (id, status) => {
    const res = await api.patch(`/products/${id}/status`, { status });
    return res.data;
  },

  reportProduct: async (reportData) => {
    const res = await api.post('/reports', reportData);
    return res.data;
  },
};
