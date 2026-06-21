import { createAxiosInstance } from './axiosInstance';
import { AI_SERVICE_URL } from '@/constants';

const aiAxios = createAxiosInstance(AI_SERVICE_URL);
export default aiAxios;
