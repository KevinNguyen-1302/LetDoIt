import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5112/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token sent:', token.substring(0, 20) + '...'); // Debug: xem token
  }
  return config;
});

// Interceptor để xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 và chưa retry, thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token available');
          return Promise.reject(error);
        }

        // Gửi refresh token request
        const response = await axios.post(
          'http://localhost:5112/api/user/RefreshToken',
          { refreshToken }
        );

        // Lưu token mới
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Xóa token và redirect về login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      console.error('401 Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;