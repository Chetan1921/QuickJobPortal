import { createAxiosInstance } from './axiosInstance';
import { JOB_SERVICE_URL } from '@/constants';

const jobAxios = createAxiosInstance(JOB_SERVICE_URL);
export default jobAxios;
