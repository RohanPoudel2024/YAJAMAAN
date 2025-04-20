import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminUsers from '../components/admin/AdminUsers';
import AdminDashboard from '../components/admin/AdminDashboard';
import { adminAPI } from '../services/adminAPI';
import '../styles/Admin.css';
import AdminBrahmins from '../components/admin/AdminBrahmins';

const AdminPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== 'admin') {
        navigate('/'); // Redirect non-admin users
      }
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // If on dashboard tab, fetch dashboard stats
        if (activeTab === 'dashboard') {
          const statsResponse = await adminAPI.getDashboardStats();
          if (statsResponse.success) {
            setDashboardData(statsResponse.data);
          }
        }
        
        // If on users tab, fetch users
        if (activeTab === 'users') {
          const usersResponse = await adminAPI.getUsers();
          if (usersResponse.success) {
            setUsers(usersResponse.data);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
        
        // Use fallback mock data in case of error
        if (activeTab === 'dashboard' && !dashboardData) {
          setDashboardData({
            users: { total: 0, brahmins: 0, yajamans: 0 },
            bookings: 0,
            rituals: 0
          });
        }
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  // Handle custom events from dashboard
  useEffect(() => {
    // Function to show add user modal
    const handleAddUser = () => {
      setActiveTab('users');
      // Set a flag to show the modal after tab change
      sessionStorage.setItem('showAddUserModal', 'true');
    };
    
    // Function to filter and show unverified brahmins
    const handleVerifyBrahmins = () => {
      setActiveTab('users');
      // Set a flag to filter brahmins after tab change
      sessionStorage.setItem('filterUnverifiedBrahmins', 'true');
    };
    
    // Function to handle bookings view
    const handleViewBookings = () => {
      setActiveTab('bookings');
    };
    
    // Function to handle settings
    const handleSettings = () => {
      setActiveTab('settings');
    };
    
    // Add event listeners
    document.addEventListener('admin-add-user', handleAddUser);
    document.addEventListener('admin-verify-brahmins', handleVerifyBrahmins);
    document.addEventListener('admin-view-bookings', handleViewBookings);
    document.addEventListener('admin-settings', handleSettings);
    
    // Clean up
    return () => {
      document.removeEventListener('admin-add-user', handleAddUser);
      document.removeEventListener('admin-verify-brahmins', handleVerifyBrahmins);
      document.removeEventListener('admin-view-bookings', handleViewBookings);
      document.removeEventListener('admin-settings', handleSettings);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && sessionStorage.getItem('showAddUserModal') === 'true') {
      // Clear the flag
      sessionStorage.removeItem('showAddUserModal');
      // Set timeout to ensure the component has mounted
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('show-add-user-modal'));
      }, 100);
    }
    
    // Check for filter brahmins flag
    if (activeTab === 'users' && sessionStorage.getItem('filterUnverifiedBrahmins') === 'true') {
      // Clear the flag
      sessionStorage.removeItem('filterUnverifiedBrahmins');
      // Set timeout to ensure the component has mounted
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('filter-unverified-brahmins'));
      }, 100);
    }
  }, [activeTab]);

  // Handle user add/edit/delete
  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
  };

  const handleUserVerified = (userId) => {
    setUsers(users.map(user => 
      user._id === userId ? {...user, isVerified: true} : user
    ));
  };

  if (error) {
    return (
      <div className="admin-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          isLoading ? 
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div> : 
          <AdminDashboard stats={dashboardData} />
        )}
        
        {activeTab === 'users' && (
          isLoading ? 
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading users data...</p>
          </div> : 
          <AdminUsers 
            users={users} 
            onUserAdded={handleUserAdded}
            onUserUpdated={handleUserUpdated}
            onUserDeleted={handleUserDeleted}
            onUserVerified={handleUserVerified}
          />
        )}
        
        {activeTab === 'brahmins' && (
          isLoading ? 
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading brahmins data...</p>
          </div> : 
          <AdminBrahmins brahmins={users.filter(user => user.role === 'brahmin')} />
        )}
        
        {activeTab === 'bookings' && <div className="coming-soon">Booking Management (Coming Soon)</div>}
        {activeTab === 'settings' && <div className="coming-soon">Admin Settings (Coming Soon)</div>}
      </div>
    </div>
  );
};

export default AdminPage;