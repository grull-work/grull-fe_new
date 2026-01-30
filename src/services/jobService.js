import api from './api';

export const jobService = {
  getJobs: (params) => api.get('/api/v0/jobs', { params }),
  getMyJobs: (params) => api.get('/api/v0/users/me/jobs', { params }),
  hireFreelancer: (data) => api.post('/api/v0/jobs/hire-freelancer', data),
  getApplicationById: (applicationId) => api.get(`/api/v0/applications/${applicationId}`),
};
