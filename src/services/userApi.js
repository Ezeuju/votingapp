import api from './api';

export const userApi = {
  getMe: () => api.get('/users/me'),
  deleteMe: () => api.delete('/users/me'),
  getById: (id) => api.get(`/users/${id}`),
  
  admin: {
    create: (data) => api.post('/users', data),
    getAll: () => api.get('/users'),
    update: (id, data) => api.put(`/users/${id}`, data),
  },
};
