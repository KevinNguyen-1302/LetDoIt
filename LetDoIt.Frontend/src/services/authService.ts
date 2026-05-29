import api from './api';
import { jwtDecode } from "jwt-decode";

export const register = async (userData: any) => {
  return await api.post('/user/Register', userData);
};

export const login = async (credentials: any) => {
  return await api.post('/user/Login', credentials);
};

export const refreshTokenAsync = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    
    if (!refreshToken || !userId) {
      return false;
    }

    const response = await api.post('/user/RefreshToken', {
      userId,
      refreshToken
    });

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Refresh token failed:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const isTokenExpiring = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const expiringTime = decoded.exp - currentTime;
    
    // Token expires trong 5 phút
    return expiringTime < 5 * 60;
  } catch (error) {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
};

export const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

export const getUserByUsername = async (username: string) => {
  const response = await api.get(`/user/GetByUsername/${username}`);
  return response.data;
};