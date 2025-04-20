// src/utils/api.js
import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:2199/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/updatedetails', userData),
};

// Add this to your src/utils/api.js file
export const uploadProfileImage = async (imageFile) => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  try {
    const response = await API.post('/auth/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    if (error.response) {
      throw error.response.data;
    } else {
      throw { success: false, error: 'Network error, please try again' };
    }
  }
};

export default API;