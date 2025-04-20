import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/yaj.svg';

const Navbar = () => {
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

  // Handle "Be Our Brahmin" click
  const handleBrahminClick = (e) => {
    e.preventDefault();
    closeMenu();
    navigate('/signup', { state: { preSelectBrahmin: true } });
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

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-header">
        <div className="navbar-logo">
          <Link to={currentUser ? '/whats-today' : '/'} onClick={closeMenu}>
            <img src={logo} alt="Yajaman Logo" />
          </Link>
        </div>
        {currentUser && (
          <div className="user-welcome">
            <span>Welcome, {currentUser.name}</span>
          </div>
        )}
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
        {currentUser ? (
          // AUTHENTICATED USER NAVIGATION
          <>
            {currentUser.role === 'yajaman' ? (
              // YAJAMAN USER NAVIGATION
              <>
                <Link to="/whats-today" onClick={closeMenu}>Home</Link>
                <Link to="/find-brahmin" onClick={closeMenu}>Find Brahmins</Link>
                <Link to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
                <Link to="/profile" onClick={closeMenu}>My Profile</Link>
                <div className="dropdown">
                  <Link to="#" className="dropbtn">Help</Link>
                  <div className="dropdown-content">
                    <a href="mailto:support@yajaman.com.np" onClick={closeMenu}>Contact Support</a>
                    <Link to="/faq" onClick={closeMenu}>FAQ</Link>
                  </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              // BRAHMIN USER NAVIGATION
              <>
                <Link to="/whats-today" onClick={closeMenu}>Home</Link>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/profile" onClick={closeMenu}>My Profile</Link>
                <div className="dropdown">
                  <Link to="#" className="dropbtn">Management</Link>
                  <div className="dropdown-content">
                    <Link to="/dashboard/bookings" onClick={closeMenu}>Bookings</Link>
                    <Link to="/dashboard/calendar" onClick={closeMenu}>Calendar</Link>
                    <Link to="/dashboard/earnings" onClick={closeMenu}>Earnings</Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link to="#" className="dropbtn">Help</Link>
                  <div className="dropdown-content">
                    <a href="mailto:support@yajaman.com.np" onClick={closeMenu}>Contact Support</a>
                    <Link to="/faq" onClick={closeMenu}>FAQ</Link>
                  </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </>
        ) : (
          // UNAUTHENTICATED USER NAVIGATION
          <>
            <Link to="/" onClick={closeMenu}>Home</Link>
            <div className="dropdown">
              <Link to="#" className="dropbtn">Services</Link>
              <div className="dropdown-content">
                <Link to="/service1" onClick={closeMenu}>Wedding Ceremonies</Link>
                <Link to="/service2" onClick={closeMenu}>House Warming</Link>
                <Link to="/service3" onClick={closeMenu}>Satyanarayan Puja</Link>
                <Link to="/service4" onClick={closeMenu}>Birthday Ceremonies</Link>
              </div>
            </div>
            <Link to="#" onClick={handleBrahminClick}>Be Our Brahmin</Link>
            <Link to="/about-us" onClick={closeMenu}>About Us</Link>
            <Link to="/contact-us" onClick={closeMenu}>Contact Us</Link>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;