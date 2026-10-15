import api from './api';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../utils/helpers';

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/api/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (response.data.access_token) {
    // Save token as string (not JSON)
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('token_type', response.data.token_type);
    // Save user info as JSON
    const userData = {
      id: response.data.user_id,
      email: response.data.email,
      full_name: response.data.full_name,
      is_admin: response.data.is_admin,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  return response.data;
};

export const googleLogin = async (email, fullName) => {
  const response = await api.post('/api/auth/google-login', null, {
    params: { email, full_name: fullName }
  });
  
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('token_type', response.data.token_type);
    const userData = {
      id: response.data.user_id,
      email: response.data.email,
      full_name: response.data.full_name,
      is_admin: response.data.is_admin,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const updateProfile = async (userData) => {
  const response = await api.put('/api/users/me', userData);
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};