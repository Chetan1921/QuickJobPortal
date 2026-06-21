import userAxios from '@/services/axios/userAxios';

export const getMyProfile = () => userAxios.get('/api/v1/user/me');

export const getUserById = (userId) => userAxios.get(`/api/v1/user/${userId}`);

export const updateProfile = (data) => userAxios.put('/api/v1/user/update/profile', data);

export const updateProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return userAxios.put('/api/v1/user/update/picture', formData);
};

export const updateResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return userAxios.put('/api/v1/user/update/resume', formData);
};

export const addSkill = (skill) => userAxios.post('/api/v1/user/add/skill', { skill });

export const deleteSkill = (skill) => userAxios.delete('/api/v1/user/delete/skill', { data: { skill } });
