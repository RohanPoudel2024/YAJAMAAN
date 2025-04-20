import axios from 'axios';

// Use environment variable for base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:2199';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth if needed
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Brahmin search
export const getBrahmins = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.ritual) queryParams.append('ritual', filters.ritual);
    if (filters.rating) queryParams.append('minRating', filters.rating);
    if (filters.date) queryParams.append('date', filters.date);
    
    const query = queryParams.toString();
    const url = `/api/v1/brahmins/search${query ? `?${query}` : ''}`;
    
    console.log(`Fetching brahmins with URL: ${API_BASE_URL}${url}`);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to load brahmins. Please try again.'
    };
  }
};

// Get brahmin by ID
export const getBrahminById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/brahmins/${id}`);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to load brahmin profile. Please try again.'
    };
  }
};

// Booking-related API calls
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create booking' };
  }
};

export const getBookings = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/bookings', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch bookings' };
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update booking status' };
  }
};

// Ritual-related API calls
export const getRituals = async () => {
  try {
    const response = await axiosInstance.get('/rituals');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch rituals' };
  }
};

// User profile-related API calls
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update profile' 
    };
  }
};

// Availability-related API calls
export const updateAvailability = async (availabilityData) => {
  try {
    const response = await axiosInstance.put('/brahmins/availability', availabilityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update availability' };
  }
};

// Review-related API calls
export const addReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add review' };
  }
};

export const getBrahminReviews = async (brahminId) => {
  try {
    const response = await axiosInstance.get(`/reviews/brahmin/${brahminId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch reviews' };
  }
};

// Profile image upload API
export const uploadProfileImage = async (formData) => {
  try {
    const response = await axiosInstance.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to upload image' 
    };
  }
};

// Password change API
export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to change password' 
    };
  }
};

// Export the axios instance for use in other API functions
export { axiosInstance };