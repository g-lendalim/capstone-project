import axios from 'axios';

const API_BASE_URL = "https://077199d5-9a43-4017-9e40-a06a2014f207-00-36zfi9kh3fc8g.pike.replit.dev";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or get from Redux/Auth context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
