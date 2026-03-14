import axios from 'axios';

const fileApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

fileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

fileApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fileApi.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
