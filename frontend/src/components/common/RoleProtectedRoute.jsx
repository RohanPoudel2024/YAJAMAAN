
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  
  if (!allowedRoles.includes(currentUser.role)) {
    
    return <Navigate to="/whats-today" />;
  }

  return children;
};

export default RoleProtectedRoute;