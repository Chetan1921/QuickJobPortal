import aiAxios from '@/services/axios/aiAxios';

export const getCareerGuidance = () => aiAxios.get('/api/v1/ai/career-guidance');

export const analyzeResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return aiAxios.post('/api/v1/ai/resume-analyze', formData);
};
