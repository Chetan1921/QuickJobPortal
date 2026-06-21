import { createAxiosInstance } from './axiosInstance';
import { AUTH_SERVICE_URL } from '@/constants';

const authAxios = createAxiosInstance(AUTH_SERVICE_URL);
export default authAxios;
