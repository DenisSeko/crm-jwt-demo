import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/notes')) {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.details 
        ? `${error.response.data.error}: ${error.response.data.details}`
        : error.response.data.error;
      alert(errorMsg);
    }
    
    return Promise.reject(error);
  }
);

export default api;
