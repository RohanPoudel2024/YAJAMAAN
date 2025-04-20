import React from 'react';
import './DownloadApp.css';
// Import your images - update these paths to match your project structure
import googlePlayImg from '../assets/google-play.png';
import appStoreImg from '../assets/app-store.png';
import phoneMockupImg from '../assets/phone-mockup.png';

const DownloadApp = () => {
  return (
    <section className="download-app-section">
      <div className="download-container">
        <div className="download-text-content">
          <h2 className="download-title">Download Yajamaan</h2>
          <p className="download-description">Download now & avail our service through the app</p>
          <div className="download-links">
            <h3 className="download-subtitle">Link below</h3>
            <div className="store-buttons">
              <img src={googlePlayImg} alt="Google Play" className="store-button" />
              <img src={appStoreImg} alt="App Store" className="store-button" />
            </div>
          </div>
        </div>
        <div className="download-image-content">
          <img src={phoneMockupImg} alt="Yajamaan App Preview" className="phone-mockup" />
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;