import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const AdminBrahmins = ({ brahmins = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredBrahmins, setFilteredBrahmins] = useState(brahmins);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    let filtered = brahmins;
    
    if (searchTerm) {
      filtered = filtered.filter(brahmin => 
        brahmin.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        brahmin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brahmin.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(brahmin => 
        filterStatus === 'verified' ? brahmin.isVerified : !brahmin.isVerified
      );
    }
    
    setFilteredBrahmins(filtered);
  }, [searchTerm, filterStatus, brahmins]);

  const handleVerifyBrahmin = async (brahminId) => {
    try {
      setLoading(true);
      setVerifyingId(brahminId);
      
      const response = await adminAPI.verifyBrahmin(brahminId);
      
      if (response.success) {
        // Update local data
        const updatedBrahmins = brahmins.map(brahmin => 
          brahmin._id === brahminId ? {...brahmin, isVerified: true} : brahmin
        );
        
        // Show success notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification success';
        toast.innerHTML = `
          <div class="toast-icon"><i class="fa fa-check-circle"></i></div>
          <div class="toast-content">
            <p class="toast-title">Brahmin Verified</p>
            <p class="toast-message">Brahmin has been verified successfully</p>
          </div>
        `;
        document.body.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 5000);
      }
    } catch (error) {
      console.error('Error verifying brahmin:', error);
      setError('Failed to verify brahmin. Please try again.');
    } finally {
      setLoading(false);
      setVerifyingId(null);
    }
  };

  const renderSpecializations = (specializations = []) => {
    return specializations.map((spec, index) => (
      <span key={index} className="specialization-tag">{spec}</span>
    ));
  };

  return (
    <div className="admin-brahmins">
      <header className="dashboard-header">
        <h1>Brahmin Management</h1>
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="fa fa-download"></i> Export Data
          </button>
        </div>
      </header>
      
      <div className="brahmin-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa fa-search"></i>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Brahmins</option>
            <option value="verified">Verified</option>
            <option value="unverified">Pending Verification</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading && <div className="brahmin-grid-loading">
        <div className="spinner"></div>
        <p>Processing request...</p>
      </div>}
      
      <div className="brahmin-grid">
        {filteredBrahmins.length > 0 ? (
          filteredBrahmins.map(brahmin => (
            <div key={brahmin._id} className="brahmin-card">
              <div className="status-indicator">
                {brahmin.isVerified ? (
                  <span className="status verified"><i className="fa fa-check-circle"></i> Verified</span>
                ) : (
                  <span className="status unverified"><i className="fa fa-clock-o"></i> Pending</span>
                )}
              </div>
              
              <div className="brahmin-avatar">
                <img src={brahmin.profileImage || "https://via.placeholder.com/150"} alt={brahmin.name} />
              </div>
              
              <div className="brahmin-details">
                <h3>{brahmin.name}</h3>
                <p className="brahmin-location">
                  <i className="fa fa-map-marker"></i> {brahmin.location || 'Location not specified'}
                </p>
                <p className="brahmin-contact">
                  <i className="fa fa-envelope"></i> {brahmin.email}
                </p>
                {brahmin.phone && (
                  <p className="brahmin-contact">
                    <i className="fa fa-phone"></i> {brahmin.phone}
                  </p>
                )}
              </div>
              
              <div className="brahmin-info-section">
                <h4>Specializations</h4>
                <div className="specialization-tags">
                  {renderSpecializations(brahmin.brahminDetails?.specialization)}
                </div>
              </div>
              
              <div className="brahmin-info-section">
                <h4>Experience</h4>
                <p>{brahmin.brahminDetails?.experience || 0} years</p>
              </div>
              
              <div className="brahmin-actions">
                <button className="btn btn-outline">
                  <i className="fa fa-eye"></i> View Profile
                </button>
                
                {!brahmin.isVerified && (
                  <button 
                    className={`btn btn-primary ${verifyingId === brahmin._id ? 'loading' : ''}`}
                    onClick={() => handleVerifyBrahmin(brahmin._id)}
                    disabled={loading || verifyingId === brahmin._id}
                  >
                    <i className="fa fa-check-circle"></i> Verify Brahmin
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fa fa-user-circle fa-3x"></i>
            <p>No brahmins match your search criteria</p>
            <button className="btn btn-outline" onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBrahmins;