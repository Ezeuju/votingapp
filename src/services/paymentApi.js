import api from './api';

export const paymentApi = {
  initialize: (data) => api.post('/payments/initialize', data),
  verify: (reference) => api.get(`/payments/verify?reference=${reference}`),
};
