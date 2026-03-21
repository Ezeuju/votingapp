import api from './api';

export const ticketApi = {
  submitTicket: (data) => api.post('/issued-tickets/user', data),
  getTicketPlans: () => api.get('/plans?type=ticket'),
};
