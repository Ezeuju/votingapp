import api from './api';

export const contactApi = {
  submit: (data) => api.post('/contact-messages/user', data),
  
  admin: {
    getAll: (params = {}) => {
      const { pageNo = 1, limitNo = 10, search = '', status = '' } = params;
      const queryParams = { pageNo, limitNo, search };
      if (status) queryParams.status = status;
      return api.get('/contact-messages/admin', { params: queryParams });
    },
    getById: (id) => api.get(`/contact-messages/${id}/admin`),
    updateStatus: (id, is_read) => api.patch(`/contact-messages/${id}/admin`, { is_read }),
    delete: (id) => api.delete(`/contact-messages/${id}/admin`),
    getStats: () => api.get('/contact-messages/stats/admin'),
  },
};
