import React from 'react';
import './Footer.css';
// Import logo image
import logo from '../assets/logo1.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-section">
            <img src={logo} alt="Yajamaan Logo" className="footer-logo" />
            <p className="footer-tagline">Your Digital Gateway to Divine Rituals!</p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-menu">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Services</h3>
              <ul className="footer-menu">
                <li><a href="#">Find a Pandit</a></li>
                <li><a href="#">Book a Puja</a></li>
                <li><a href="#">Ask a Question</a></li>
                <li><a href="#">Spiritual Consultation</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <ul className="footer-menu">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Sacred Texts</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Legal</h3>
              <ul className="footer-menu">
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Trust & Safety</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Yajamaan. All rights reserved.</p>
          <div className="footer-app-links">
            <a href="#" className="app-link">
              <i className="fab fa-google-play"></i> Google Play
            </a>
            <a href="#" className="app-link">
              <i className="fab fa-apple"></i> App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;