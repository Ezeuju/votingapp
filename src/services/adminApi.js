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
  }
};
