import axios from 'axios';
import BAPI from '../helper/variable';

const api = axios.create({
  baseURL: BAPI,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses here (e.g., 401 unauthorized)
    if (error.response && error.response.status === 401) {
       // Logic to handle token expiration (e.g., redirect to login)
       // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
