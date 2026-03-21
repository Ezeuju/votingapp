import api from "./api";

export const adminApi = {
  getUsers: (params = {}) => {
    const {
      account_type = "Applicant",
      pageNo = 1,
      limitNo = 10,
      search = "",
    } = params;
    return api.get("/users/admin", {
      params: { account_type, pageNo, limitNo, search },
    });
  },

  getUserById: (userId) => {
    return api.get(`/users/${userId}/admin`);
  },

  getAuditionStats: () => {
    return api.get("/users/audition/stats/admin");
  },

  deleteAudition: (userId) => {
    return api.delete(`/users/${userId}/audition/admin`);
  },

  getDonors: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = "" } = params;
    return api.get("/donors/admin", {
      params: { pageNo, limitNo, search },
    });
  },

  getDonorById: (donorId) => {
    return api.get(`/donors/${donorId}/admin`);
  },

  getDonorStats: () => {
    return api.get("/donors/stats/admin");
  },

  getDonorSummary: () => {
    return api.get("/donors/summary/admin");
  },

  deleteDonor: (donorId) => {
    return api.delete(`/donors/${donorId}/admin`);
  },

  getTeams: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = "" } = params;
    return api.get("/teams/admin", {
      params: { pageNo, limitNo, search },
    });
  },

  getTeamById: (teamId) => {
    return api.get(`/teams/${teamId}/admin`);
  },

  updateTeamStatus: (teamId, status) => {
    return api.patch(`/teams/${teamId}/admin`, { status });
  },

  getTeamStats: () => {
    return api.get("/teams/stats/admin");
  },

  getLiveUpdates: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = "" } = params;
    return api.get("/live-updates/admin", {
      params: { pageNo, limitNo, search },
    });
  },

  createLiveUpdate: (message) => {
    return api.post("/live-updates/admin", { message });
  },

  updateLiveUpdate: (updateId, is_pin) => {
    return api.patch(`/live-updates/${updateId}/admin`, { is_pin });
  },

  deleteLiveUpdate: (updateId) => {
    return api.delete(`/live-updates/${updateId}/admin`);
  },

  getContestants: (params = {}) => {
    const {
      pageNo = 1,
      limitNo = 100,
      filter = "contestant_number",
      order = 1,
    } = params;
    return api.get("/users/admin", {
      params: { account_type: "Contestant", pageNo, limitNo, filter, order },
    });
  },

  convertToContestant: (userId, data) => {
    return api.patch(`/users/${userId}/convert-to-contestant/admin`, data);
  },

  updateContestantStatus: (userId, action) => {
    return api.patch(`/users/${userId}/contestant-status/admin`, { action });
  },

  removeContestant: (userId) => {
    return api.delete(`/users/${userId}/contestant/admin`);
  },

  getContestantStats: () => {
    return api.get("/users/contestant/stats/admin");
  },

  // ── Judges ──
  getJudges: (params = {}) => {
    const { pageNo = 1, limitNo = 100, search = '' } = params;
    return api.get('/judges/admin', { params: { pageNo, limitNo, search } });
  },

  getJudgeById: (id) => {
    return api.get(`/judges/${id}/admin`);
  },

  createJudge: (data) => {
    return api.post('/judges/admin', data);
  },

  updateJudge: (id, data) => {
    return api.patch(`/judges/${id}/admin`, data);
  },

  deleteJudge: (id) => {
    return api.delete(`/judges/${id}/admin`);
  },

  // ── Announcements / Timelines ──
  getTimelines: (params = {}) => {
    const { pageNo = 1, limitNo = 100, search = '' } = params;
    return api.get('/timelines', { params: { pageNo, limitNo, search } });
  },

  createTimeline: (data) => {
    return api.post('/timelines', data);
  },

  updateTimeline: (id, data) => {
    return api.patch(`/timelines/${id}`, data);
  },

  deleteTimeline: (id) => {
    return api.delete(`/timelines/${id}`);
  },

  // ── Tickets ──
  getTickets: (params = {}) => {
    const { pageNo = 1, limitNo = 10, search = '' } = params;
    return api.get('/issued-tickets', { params: { pageNo, limitNo, search } });
  },

  getTicketStats: () => {
    return api.get('/issued-tickets/stats');
  },

  getTotalVotes: () => {
    return api.get('/users/votes');
  },

  getTicketById: (id) => {
    return api.get(`/issued-tickets/${id}`);
  },

  issueTicket: (data) => {
    return api.post('/issued-tickets', data);
  },

  updateTicket: (id, data) => {
    return api.patch(`/issued-tickets/${id}`, data);
  },
};
