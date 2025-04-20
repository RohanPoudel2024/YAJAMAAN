import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '..styles/AuthNavbar.css';
import logo from '../assets/yaj.svg';

const AuthNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      closeMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="auth-navbar" ref={navRef}>
      <div className="navbar-header">
        <div className="navbar-logo">
          <Link to="/whats-today" onClick={closeMenu}>
            <img src={logo} alt="Yajaman Logo" />
          </Link>
        </div>
        <div className="user-info">
          <span className="user-name">{currentUser?.name}</span>
          <span className="user-role">{currentUser?.role}</span>
        </div>
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        {currentUser?.role === 'yajaman' ? (
          // YAJAMAN USER NAVIGATION
          <>
            <Link to="/whats-today" onClick={closeMenu} className="nav-item">
              <i className="icon-home"></i> Home
            </Link>
            <Link to="/find-brahmin" onClick={closeMenu} className="nav-item">
              <i className="icon-search"></i> Find Brahmins
            </Link>
            <Link to="/my-bookings" onClick={closeMenu} className="nav-item">
              <i className="icon-calendar"></i> My Bookings
            </Link>
            <Link to="/profile" onClick={closeMenu} className="nav-item">
              <i className="icon-user"></i> Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <i className="icon-logout"></i> Logout
            </button>
          </>
        ) : (
          // BRAHMIN USER NAVIGATION
          <>
            <Link to="/whats-today" onClick={closeMenu} className="nav-item">
              <i className="icon-home"></i> Home
            </Link>
            <Link to="/dashboard" onClick={closeMenu} className="nav-item">
              <i className="icon-dashboard"></i> Dashboard
            </Link>
            <Link to="/dashboard/bookings" onClick={closeMenu} className="nav-item">
              <i className="icon-bookings"></i> Bookings
            </Link>
            <Link to="/dashboard/calendar" onClick={closeMenu} className="nav-item">
              <i className="icon-calendar"></i> Calendar
            </Link>
            <Link to="/profile" onClick={closeMenu} className="nav-item">
              <i className="icon-user"></i> Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <i className="icon-logout"></i> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;