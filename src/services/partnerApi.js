import api from './api';

export const partnerApi = {
  getPlans: () => api.get('/plans?type=partnership'),
  submitUser: (data) => api.post('/partners/user', data),
  addAdmin: (data) => api.post('/partners/admin', data),
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.sponsorship_tier) query.append('sponsorship_tier', params.sponsorship_tier);
    if (params.search) query.append('search', params.search);
    if (params.pageNo) query.append('pageNo', params.pageNo);
    if (params.limitNo) query.append('limitNo', params.limitNo);
    return api.get(`/partners/admin?${query.toString()}`);
  },
  getOne: (id) => api.get(`/partners/${id}/admin`),
  update: (id, data) => api.patch(`/partners/${id}/admin`, data),
  delete: (id) => api.delete(`/partners/${id}/admin`),
  getStats: () => api.get('/partners/stats/admin'),
};
