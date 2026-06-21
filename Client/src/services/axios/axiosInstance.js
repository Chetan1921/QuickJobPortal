import axios from 'axios';
import { store } from '@/store/store';
import { logout } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';

export const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  // Attach JWT on every request
  instance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401/403/500 globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        toast.error('Session expired. Please login again.');
        store.dispatch(logout());
        window.location.href = '/login';
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
