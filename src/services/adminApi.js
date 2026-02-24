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
  },

  getTeams: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = '' } = params;
    return api.get('/teams/admin', {
      params: { pageNo, limitNo, search }
    });
  },

  getTeamById: (teamId) => {
    return api.get(`/teams/${teamId}/admin`);
  },

  updateTeamStatus: (teamId, status) => {
    return api.patch(`/teams/${teamId}/admin`, { status });
  },

  getTeamStats: () => {
    return api.get('/teams/stats/admin');
  },

  getLiveUpdates: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = '' } = params;
    return api.get('/live-updates/admin', {
      params: { pageNo, limitNo, search }
    });
  },

  createLiveUpdate: (message) => {
    return api.post('/live-updates/admin', { message });
  },

  updateLiveUpdate: (updateId, is_pin) => {
    return api.patch(`/live-updates/${updateId}/admin`, { is_pin });
  },

  deleteLiveUpdate: (updateId) => {
    return api.delete(`/live-updates/${updateId}/admin`);
  }
};
