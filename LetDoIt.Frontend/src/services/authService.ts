import api from './api';

export const register = async (userData: any) => {
  // URL sẽ là: /api/user/Register (vì dùng [action] như đã bàn)
  return await api.post('/user/Register', userData);
};

export const login = async (credentials: any) => {
  return await api.post('/user/Login', credentials);
};