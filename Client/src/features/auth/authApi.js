import authAxios from '@/services/axios/authAxios';

export const registerUser = (formData) =>
  authAxios.post('/api/v1/auth/register', formData);

export const loginUser = (data) =>
  authAxios.post('/api/v1/auth/login', data);

export const forgotPassword = (email) =>
  authAxios.post('/api/v1/auth/forgot', { email });

export const resetPassword = (token, password) =>
  authAxios.post(`/api/v1/auth/reset/${token}`, { password });
