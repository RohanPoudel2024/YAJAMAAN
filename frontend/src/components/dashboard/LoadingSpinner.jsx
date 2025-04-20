import React from 'react';
import '../../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner-wrapper">
        <div className="spinner-ring"></div>
        <div className="spinner-center"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;