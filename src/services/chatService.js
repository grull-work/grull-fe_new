import api from './api';

export const chatService = {
  getManagerChats: () => api.get('/api/v0/chats/get-manager-chats'),
  getFreelancerChats: () => api.get('/api/v0/chats/get-freelancer-chats'),
  sendMessage: (messageData) => api.post('/api/v0/chats/send-message', messageData),
  updateMessage: (data) => api.post('/api/v0/chats/update-deliverable', data),
  updateDeliverable: (deliverableData) => api.post('/api/v0/chats/update-deliverable', deliverableData),
  resubmitDeliverable: (data) => api.post('/api/v0/chats/resubmit-deliverable', data),
  updateMessageStatus: (data) => api.post('/api/v0/chats/update-message-status', data),
  acceptPrice: (data) => api.post('/api/v0/jobs/accept-price', data),
  getRemainingDeliverables: (jobId) => api.get(`/api/v0/jobs/${jobId}/remaining-deliverables`),
  updateRemainingDeliverables: (data) => api.post('/api/v0/jobs/update-remaining-deliverables', data),
  createNotification: (notification) => api.post('/api/v0/notifications/create-notification', notification),
  getChatById: (chatId) => api.get(`/api/v0/chats/${chatId}/get-chat-by-id`),
  getChatMessages: (chatId, page = null, perPage = null) => {
    let url = `/api/v0/chats/get-chat-message-by_id/${chatId}`;
    if (page || perPage) {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (perPage) params.append('per_page', perPage);
      url += `?${params.toString()}`;
    }
    return api.get(url);
  },
  processDeliverable: (data) => api.post('/api/v0/chats/process-deliverable', data),
  deleteMessage: (messageId) => api.delete(`/api/v0/chats/delete-message/${messageId}`),
};
