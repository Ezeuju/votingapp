import api from './api';

export const paymentApi = {
  initialize: (data) => api.post('/payments/initialize', data),
  verify: (reference) => api.get(`/payments/verify?reference=${reference}`),
  
  donations: {
    initialize: (data) => api.post('/payments/donations/initialize', data),
    verify: (reference) => api.get(`/payments/donations/verify?reference=${reference}`),
  },
};
