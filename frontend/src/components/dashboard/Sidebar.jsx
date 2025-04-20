import React from 'react';
import '../../styles/dashboard.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Import React icons
import { 
  FiHome, 
  FiBook, 
  FiDollarSign, 
  FiCalendar, 
  FiUser, 
  FiStar, 
  FiLogOut 
} from 'react-icons/fi';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation items with React icons
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'bookings', label: 'Bookings', icon: <FiBook /> },
    { id: 'earnings', label: 'Earnings & Payments', icon: <FiDollarSign /> },
    { id: 'calendar', label: 'Calendar', icon: <FiCalendar /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'reviews', label: 'Reviews', icon: <FiStar /> }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="dashboard-sidebar">
      <div className="sidebar-header">
        <h1 className="logo">यजमान</h1>
        <p className="tagline">Brahmin Dashboard</p>
      </div>
      
      <div className="profile-brief">
        <img 
          src={currentUser?.profileImage || "/def.png"} 
          alt="Profile" 
          className="profile-img" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/def.png";
          }}
        />
        <div className="profile-info">
          <h3>{currentUser?.name || 'Brahmin User'}</h3>
          <span className="status online">Available</span>
        </div>
      </div>
      
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`}>
            <button className="nav-button" onClick={() => setActiveSection(item.id)}>
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
        <p className="version">v1.0.0</p>
      </div>
    </nav>
  );
};

export default Sidebar;