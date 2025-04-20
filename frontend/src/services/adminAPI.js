import axios from 'axios';
import { API_URL } from '../config';

// Create an axios instance with auth headers
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    withCredentials: true // Add this to include cookies
  });
};

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await authAxios().get('/api/v1/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return a default response structure to prevent UI errors
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard data',
        data: {
          users: { total: 0, brahmins: 0, yajamans: 0 },
          bookings: 0,
          rituals: 0
        }
      };
    }
  },
  
  // User management
  getUsers: async () => {
    try {
      const response = await authAxios().get('/api/v1/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getUser: async (id) => {
    try {
      const response = await authAxios().get(`/api/v1/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  addUser: async (userData) => {
    try {
      const response = await authAxios().post('/api/v1/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await authAxios().put(`/api/v1/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await authAxios().delete(`/api/v1/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
  
  // Brahmin verification
  verifyBrahmin: async (id) => {
    try {
      const response = await authAxios().put(`/api/v1/admin/verify-brahmin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error verifying brahmin ${id}:`, error);
      throw error;
    }
  }
};