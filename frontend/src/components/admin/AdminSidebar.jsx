import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>यजमान Admin</h2>
        <p>Administration Panel</p>
      </div>
      
      <ul className="sidebar-menu">
        <li className={activeTab === 'dashboard' ? 'active' : ''}>
          <button onClick={() => setActiveTab('dashboard')}>
            <i className="fa fa-dashboard"></i> Dashboard
          </button>
        </li>
        <li className={activeTab === 'users' ? 'active' : ''}>
          <button onClick={() => setActiveTab('users')}>
            <i className="fa fa-users"></i> Users
          </button>
        </li>
        <li className={activeTab === 'brahmins' ? 'active' : ''}>
          <button onClick={() => setActiveTab('brahmins')}>
            <i className="fa fa-user-circle"></i> Brahmins
          </button>
        </li>
        <li className={activeTab === 'bookings' ? 'active' : ''}>
          <button onClick={() => setActiveTab('bookings')}>
            <i className="fa fa-calendar-check-o"></i> Bookings
          </button>
        </li>
        <li className={activeTab === 'settings' ? 'active' : ''}>
          <button onClick={() => setActiveTab('settings')}>
            <i className="fa fa-cog"></i> Settings
          </button>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <button className="back-to-site" onClick={() => navigate('/')}>
          <i className="fa fa-arrow-left"></i> Back to Site
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;