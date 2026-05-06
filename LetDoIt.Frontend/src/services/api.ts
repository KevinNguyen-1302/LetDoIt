import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5112/api',
});

// Interceptor này bây giờ chỉ cần lo việc gắn Token thôi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;