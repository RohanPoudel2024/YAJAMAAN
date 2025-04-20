import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when app loads
    const fetchUser = async () => {
      try {
        const response = await authAPI.getProfile();
        console.log("Auto login response:", response);
        if (response.data && response.data.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.log("Not logged in:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log("Login response:", response);
      
      if (response.data && response.data.success) {
        setCurrentUser(response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log("Register response:", response);
      
      if (response.data && response.data.success) {
        setCurrentUser(response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Register error in context:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data && response.data.success) {
        setCurrentUser(response.data.data);
      }
      return response.data.data;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;