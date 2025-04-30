import axios from 'axios';

const API_BASE_URL = "https://e4254de5-9bc0-4814-a621-e6cc051e1893-00-8t2uq3t83cm2.pike.replit.dev";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token to requests if available
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token'); // Try to get the token from localStorage

    if (!token) {
      // If there's no token in localStorage, try refreshing the token
      token = await getFreshToken();
      if (token) {
        localStorage.setItem('token', token); // Optionally store it in localStorage again
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to request headers
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;