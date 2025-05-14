import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = "https://capstone-api-sable.vercel.app/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

async function getFreshToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(); // gets a fresh ID token
  }
  return null;
}

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