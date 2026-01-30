import api from './api';

export const userService = {
  getUserById: (userId) => api.get(`/api/v0/users/${userId}`),
  updateUser: (userData) => api.post('/api/v0/users/update', userData), // Example
  getFreelancers: (params) => api.get('/api/v0/freelancers', { params }),
  getMe: () => api.get('/api/v0/users/me'),
  updateMe: (data) => api.patch('/api/v0/users/me', data),
};
