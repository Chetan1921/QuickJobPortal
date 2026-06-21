import { createAxiosInstance } from './axiosInstance';
import { USER_SERVICE_URL } from '@/constants';

const userAxios = createAxiosInstance(USER_SERVICE_URL);
export default userAxios;
