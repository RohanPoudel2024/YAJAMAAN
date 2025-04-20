import React from 'react';
import '../../styles/dashboard.css';

const DashboardNavigation = ({ activeSection, setActiveSection }) => {
  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'bookings', label: 'Bookings', icon: 'book' },
    { id: 'earnings', label: 'Earnings & Payments', icon: 'money' },
    { id: 'calendar', label: 'Calendar & Upcoming Rituals', icon: 'calendar' },
    { id: 'profile', label: 'Profile & Availability', icon: 'user' },
    { id: 'reviews', label: 'Customer Reviews', icon: 'star' }
  ];

  return (
    <nav className="dashboard-navigation">
      <div className="sidebar-header">
        <h1 className="logo">RitualConnect</h1>
        <p className="tagline">Connecting Devotees & Brahmins</p>
      </div>
      
      <div className="profile-brief">
        <img src="/profile-avatar.jpg" alt="Profile" className="profile-img" />
        <h3>Pandit Sharma</h3>
        <span className="status online">Available</span>
      </div>
      
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`}>
            <button className="nav-button" onClick={() => setActiveSection(item.id)}>
              <span className={`icon ${item.icon}`}></span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <button className="logout-btn">
          <span className="icon logout"></span>
          Logout
        </button>
        <p className="version">Version 1.0.2</p>
      </div>
    </nav>
  );
};

export default DashboardNavigation;