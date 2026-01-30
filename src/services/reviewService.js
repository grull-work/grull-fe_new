import api from './api';

export const reviewService = {
  createReview: (reviewData) => api.post('/api/v0/reviews/create-reviews', reviewData),
  getReviews: () => api.get('/api/v0/reviews/reviews'),
};
