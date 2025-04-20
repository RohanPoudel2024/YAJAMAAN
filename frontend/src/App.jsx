// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Land from './components/common/Land';
import YajamanProfile from './components/profile/YajamanProfile';
import BrahminSearch from './components/brahmin/BrahminSearch';
import BrahminProfile from './components/brahmin/BrahminProfile';
import BookingForm from './components/brahmin/BookingForm';
import AdminPage from './pages/AdminPage';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/whats-today" element={
            <ProtectedRoute>
              <Land />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={
            <RoleProtectedRoute allowedRoles={['brahmin', 'admin']}>
              <Dashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <YajamanProfile />
            </ProtectedRoute>
          } />
          <Route path="/find-brahmin" element={<BrahminSearch />} />
          <Route path="/brahmin/:id" element={<BrahminProfile />} />
          <Route path="/book/:brahminId" element={<BookingForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;