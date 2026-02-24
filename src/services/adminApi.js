import api from './api';

export const adminApi = {
  getUsers: (params = {}) => {
    const { account_type = 'Applicant', pageNo = 1, limitNo = 10, search = '' } = params;
    return api.get('/users/admin', {
      params: { account_type, pageNo, limitNo, search }
    });
  },

  getUserById: (userId) => {
    return api.get(`/users/${userId}/admin`);
  },

  getAuditionStats: () => {
    return api.get('/users/audition/stats/admin');
  },

  deleteAudition: (userId) => {
    return api.delete(`/users/${userId}/audition/admin`);
  },

  getDonors: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = '' } = params;
    return api.get('/donors/admin', {
      params: { pageNo, limitNo, search }
    });
  },

  getDonorById: (donorId) => {
    return api.get(`/donors/${donorId}/admin`);
  },

  getDonorStats: () => {
    return api.get('/donors/stats/admin');
  },

  getDonorSummary: () => {
    return api.get('/donors/summary/admin');
  },

  deleteDonor: (donorId) => {
    return api.delete(`/donors/${donorId}/admin`);
  }
};
