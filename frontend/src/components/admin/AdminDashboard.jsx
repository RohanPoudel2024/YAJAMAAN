import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ stats }) => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    switch(action) {
      case 'add-user':
        document.dispatchEvent(new CustomEvent('admin-add-user'));
        break;
      case 'verify-brahmins':
        document.dispatchEvent(new CustomEvent('admin-verify-brahmins'));
        break;
      case 'view-bookings':
        document.dispatchEvent(new CustomEvent('admin-view-bookings'));
        break;
      case 'manage-rituals':
        // Future implementation
        break;
      case 'settings':
        document.dispatchEvent(new CustomEvent('admin-settings'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon user-icon">
            <i className="fa fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.users?.total || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon brahmin-icon">
            <i className="fa fa-user-circle"></i>
          </div>
          <div className="stat-details">
            <h3>Brahmins</h3>
            <p className="stat-value">{stats?.users?.brahmins || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon yajaman-icon">
            <i className="fa fa-user"></i>
          </div>
          <div className="stat-details">
            <h3>Yajamans</h3>
            <p className="stat-value">{stats?.users?.yajamans || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon booking-icon">
            <i className="fa fa-calendar"></i>
          </div>
          <div className="stat-details">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats?.bookings || 0}</p>
          </div>
        </div>
      </div>
      
      <h2 className="section-title">Quick Actions</h2>
      <div className="admin-grid">
        <div className="action-card" onClick={() => handleAction('add-user')}>
          <div className="action-icon add-user">
            <i className="fa fa-user-plus"></i>
          </div>
          <div className="action-content">
            <h3>Add New User</h3>
            <p>Create new admin, brahmin or yajaman accounts</p>
          </div>
        </div>
        
        <div className="action-card" onClick={() => handleAction('verify-brahmins')}>
          <div className="action-icon verify-brahmin">
            <i className="fa fa-check-circle"></i>
          </div>
          <div className="action-content">
            <h3>Verify Brahmins</h3>
            <p>Review and approve pending brahmin verifications</p>
            {stats?.users?.brahmins > 0 && <span className="badge">{Math.floor(stats?.users?.brahmins * 0.3)}</span>}
          </div>
        </div>
        
        <div className="action-card" onClick={() => handleAction('view-bookings')}>
          <div className="action-icon view-bookings">
            <i className="fa fa-calendar-check-o"></i>
          </div>
          <div className="action-content">
            <h3>Manage Bookings</h3>
            <p>View and manage all ritual bookings</p>
          </div>
        </div>
        
        <div className="action-card" onClick={() => handleAction('manage-rituals')}>
          <div className="action-icon manage-rituals">
            <i className="fa fa-book"></i>
          </div>
          <div className="action-content">
            <h3>Manage Rituals</h3>
            <p>Add, edit or remove ritual types</p>
          </div>
        </div>
        
        <div className="action-card" onClick={() => handleAction('settings')}>
          <div className="action-icon settings">
            <i className="fa fa-cog"></i>
          </div>
          <div className="action-content">
            <h3>Platform Settings</h3>
            <p>Manage global settings and configurations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;