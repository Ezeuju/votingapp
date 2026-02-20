import api from './api';

export const planApi = {
  getAll: (type = 'audition') => api.get(`/plans?type=${type}`),
  create: (data) => api.post('/plans', data),
};
