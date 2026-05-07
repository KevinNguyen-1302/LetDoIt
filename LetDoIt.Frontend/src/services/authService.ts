import api from './api';

export const register = async (userData: any) => {
  return await api.post('/user/Register', userData);
};

export const login = async (credentials: any) => {
  return await api.post('/user/Login', credentials);
};