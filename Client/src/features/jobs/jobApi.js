import jobAxios from '@/services/axios/jobAxios';

// Helper: these routes are wired behind multer's upload.single('file') middleware
// on the backend even though they don't take a file, and Multer expects
// multipart/form-data — so we send FormData instead of a JSON body.
const toFormData = (obj) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  return formData;
};

export const getActiveJobs = (params) => jobAxios.get('/Activejob', { params });

export const getJobById = (jobId) => jobAxios.get(`/${jobId}`);

export const createJob = (data) => jobAxios.post('/new', toFormData(data));

export const updateJob = (jobId, data) => jobAxios.put(`/update/${jobId}`, toFormData(data));

export const applyForJob = (jobId) => jobAxios.post('/apply', toFormData({ jobId }));

export const getMyApplications = (params) => jobAxios.get('/application/all', { params });

export const getApplicationsByJob = (jobId) => jobAxios.get(`/application/${jobId}`);

export const updateApplicationStatus = (id, status) => jobAxios.put(`/application/update/${id}`, { status });
