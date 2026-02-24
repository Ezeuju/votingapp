import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/users/register', data),
  login: (data) => api.post('/auth/users/login', data),
  logout: () => api.post('/auth/users/logout'),
  sendOTP: (data) => api.post('/auth/users/send-otp', data),
  verifyOTP: (data) => api.post('/auth/users/verify-otp', data),
  resetPassword: (data) => api.post('/auth/users/reset-password', data),
  changePassword: (data) => api.post('/auth/users/change-password', data),
  refreshToken: () => api.post('/auth/refresh-token'),
  
  admin: {
    login: (data) => api.post('/auths/admins/login', data),
    sendOTP: (data) => api.post('/auth/admins/send-otp', data),
    verifyOTP: (data) => api.post('/auth/admins/verify-otp', data),
    resetPassword: (data) => api.post('/auth/admins/reset-password', data),
    changePassword: (data) => api.post('/auth/admins/change-password', data),
  },
};
