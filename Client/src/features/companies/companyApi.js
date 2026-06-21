import jobAxios from '@/services/axios/jobAxios';

export const createCompany = (data) => jobAxios.post('/company/new', data);

export const deleteCompany = (companyId) => jobAxios.delete(`/delete/${companyId}`);

export const getAllCompanies = (params) => jobAxios.get('/all', { params });

export const getCompanyById = (companyId) => jobAxios.get(`/company/${companyId}`);
