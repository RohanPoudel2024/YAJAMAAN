import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/yajamanProfile.css';
import { useAuth } from '../../context/AuthContext';
import { uploadProfileImage, authAPI } from '../../utils/api';
import Navbar from '../Navbar';
import { getImageUrl } from '../../utils/helpers';

const YajamanProfile = () => {
  const { currentUser, logout, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageSuccess, setImageSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const userProfile = {
    name: currentUser?.name || "Guest User",
    email: currentUser?.email || "guest@example.com",
    phone: currentUser?.phone || "Not available",
    location: currentUser?.location || "Not available",
    joinedDate: "January 2024",
    upcomingBookings: 2,
    completedRituals: 5,
    savedBrahmins: 3,
    preferredRituals: ["Griha Pravesh", "Satyanarayan Puja", "Ganesh Puja"]
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (imageSuccess) {
      const timer = setTimeout(() => {
        setImageSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [imageSuccess]);

  const upcomingBookings = [
    {
      id: 1,
      ritualName: "Griha Pravesh",
      date: "2024-03-25",
      time: "09:00 AM",
      brahmin: "Pandit Ramesh Sharma",
      status: "confirmed",
      amount: 15000,
      location: "Balaju, Kathmandu"
    },
    {
      id: 2,
      ritualName: "Satyanarayan Puja",
      date: "2024-04-10",
      time: "10:30 AM",
      brahmin: "Pandit Krishna Joshi",
      status: "pending",
      amount: 12000,
      location: "Patan, Lalitpur"
    }
  ];

  const bookingHistory = [
    {
      id: 101,
      ritualName: "Satyanarayan Puja",
      date: "2024-02-15",
      brahmin: "Pandit Krishna Joshi",
      status: "completed",
      amount: 12000,
      rating: 5,
      reviewComment: "Excellent service, very knowledgeable and professional."
    },
    {
      id: 102,
      ritualName: "Griha Shanti",
      date: "2024-01-20",
      brahmin: "Pandit Mohan Bhatt",
      status: "completed",
      amount: 8000,
      rating: 4,
      reviewComment: "Good service, would recommend."
    },
    {
      id: 103,
      ritualName: "Navagraha Puja",
      date: "2023-12-05",
      brahmin: "Pandit Ramesh Sharma",
      status: "completed",
      amount: 10000,
      rating: 5,
      reviewComment: "Perfect ritual performance, very satisfied."
    }
  ];

  const savedBrahmins = [
    {
      id: 201,
      name: "Pandit Ramesh Sharma",
      specialization: "Vedic Rituals",
      rating: 4.8,
      image: "/assets/pandit1.jpg"
    },
    {
      id: 202,
      name: "Pandit Krishna Joshi",
      specialization: "Marriage Ceremonies",
      rating: 4.9,
      image: "/assets/pandit2.jpg"
    },
    {
      id: 203,
      name: "Pandit Mohan Bhatt",
      specialization: "Graha Shanti",
      rating: 4.7,
      image: "/assets/pandit3.jpg"
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset messages
    setImageError('');
    setImageSuccess('');

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Please select a JPEG or PNG image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB.');
      return;
    }

    setUploading(true);

    try {
      const result = await uploadProfileImage(file);
      console.log('Upload result:', result);
      
      if (result.success) {
        // Refresh user data after successful upload
        await refreshUserData();
        setImageSuccess('Profile image updated successfully!');
      } else {
        setImageError(result.error || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImageError(error.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    setUpdateError('');
    setUpdateSuccess('');
    
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      location: formData.get('location')
    };
    
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.data.success) {
        await refreshUserData();
        setUpdateSuccess('Profile updated successfully!');
        setTimeout(() => setUpdateSuccess(''), 3000);
      } else {
        setUpdateError(response.data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message || 'An error occurred while updating your profile');
    }
  };

  return (
    <div className="yajaman-profile-container">
      <Navbar />
      {/* Hero Banner */}
      <div className="profile-hero">
        <div className="profile-hero-overlay">
          <h1>My Yajaman Profile</h1>
          <p>Manage your sacred journey</p>
        </div>
      </div>

      <div className="yajaman-profile">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="profile-info">
            <div className="avatar-container">
              <img 
                src={getImageUrl(currentUser?.profileImage)} 
                alt={userProfile.name} 
                className="profile-avatar" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default-avatar.png";
                }}
              />
              <button 
                className="change-avatar-btn" 
                onClick={handleAvatarClick}
                disabled={uploading}
                title="Change profile photo"
              >
                {uploading ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa fa-camera"></i>
                )}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/jpeg, image/png, image/jpg"
              />
            </div>
            {imageError && <div className="image-upload-error">{imageError}</div>}
            {imageSuccess && <div className="image-upload-success">{imageSuccess}</div>}
            
            <div className="profile-details">
              <h1>{userProfile.name}</h1>
              <p className="location"><i className="fa fa-map-marker"></i> {userProfile.location}</p>
              <p className="joined-date"><i className="fa fa-calendar"></i> Member since {userProfile.joinedDate}</p>
              <div className="contact-info">
                <p><i className="fa fa-envelope"></i> {userProfile.email}</p>
                <p><i className="fa fa-phone"></i> {userProfile.phone}</p>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => setActiveTab('settings')}>
              <i className="fa fa-edit"></i> Edit Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </div>
        </header>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{userProfile.upcomingBookings}</span>
            <span className="stat-label">Upcoming Bookings</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{userProfile.completedRituals}</span>
            <span className="stat-label">Completed Rituals</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{userProfile.savedBrahmins}</span>
            <span className="stat-label">Saved Brahmins</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{bookingHistory.reduce((avg, booking) => avg + booking.rating, 0) / bookingHistory.length}</span>
            <span className="stat-label">Avg. Rating Given</span>
          </div>
        </div>

        {/* Profile Navigation */}
        <nav className="profile-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fa fa-home"></i> Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="fa fa-calendar-check-o"></i> My Bookings
          </button>
          <button 
            className={`nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <i className="fa fa-bookmark"></i> Saved Brahmins
          </button>
          <button 
            className={`nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="fa fa-sliders"></i> Preferences
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fa fa-cog"></i> Settings
          </button>
        </nav>

        {/* Profile Content */}
        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="section-header">
                <h2><i className="fa fa-calendar"></i> Upcoming Rituals</h2>
                <Link to="/bookings" className="view-all-link">View All <i className="fa fa-arrow-right"></i></Link>
              </div>
              
              <div className="upcoming-rituals">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-date">
                        <span className="date">{new Date(booking.date).getDate()}</span>
                        <span className="month">
                          {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <div className="booking-details">
                        <h3>{booking.ritualName}</h3>
                        <p><i className="fa fa-clock-o"></i> {booking.time}</p>
                        <p><i className="fa fa-user"></i> {booking.brahmin}</p>
                        <p><i className="fa fa-map-marker"></i> {booking.location}</p>
                      </div>
                      <div className="booking-status">
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                        <div className="amount">रु{booking.amount}</div>
                        <button className="action-btn">View Details</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fa fa-calendar-o empty-icon"></i>
                    <h3>No Upcoming Rituals</h3>
                    <p>You don't have any scheduled rituals at the moment.</p>
                    <Link to="/book" className="get-started-button">Book a Ritual</Link>
                  </div>
                )}
              </div>

              <div className="section-header">
                <h2><i className="fa fa-user-circle"></i> Recommended Brahmins</h2>
                <Link to="/brahmins" className="view-all-link">View All <i className="fa fa-arrow-right"></i></Link>
              </div>
              
              <div className="recommended-brahmins">
                {savedBrahmins.map(brahmin => (
                  <div key={brahmin.id} className="brahmin-card">
                    <img src={brahmin.image} alt={brahmin.name} className="brahmin-img" />
                    <div className="brahmin-info">
                      <h3>{brahmin.name}</h3>
                      <p>{brahmin.specialization}</p>
                      <div className="rating">
                        <span className="stars">★</span> {brahmin.rating}
                      </div>
                    </div>
                    <button className="book-now-btn">Book Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <div className="section-tabs">
                <button className="section-tab active">All Bookings</button>
                <button className="section-tab">Upcoming</button>
                <button className="section-tab">Completed</button>
                <button className="section-tab">Cancelled</button>
              </div>
              
              <div className="booking-history">
                <div className="section-header">
                  <h2>Booking History</h2>
                  <div className="booking-filters">
                    <select className="filter-select">
                      <option>All Time</option>
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                      <option>Last Year</option>
                    </select>
                    <button className="filter-btn">
                      <i className="fa fa-filter"></i> Filter
                    </button>
                  </div>
                </div>
                
                <div className="booking-list">
                  {bookingHistory.map(booking => (
                    <div key={booking.id} className="history-card">
                      <div className="history-date">
                        <span className="date-label">{new Date(booking.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="history-info">
                        <h3>{booking.ritualName}</h3>
                        <p><i className="fa fa-user"></i> {booking.brahmin}</p>
                        <div className="rating-display">
                          <span>Your Rating: </span>
                          <span className="stars">{'★'.repeat(booking.rating)}</span>
                        </div>
                        <p className="review-comment">"{booking.reviewComment}"</p>
                      </div>
                      <div className="history-actions">
                        <div className="amount">रु{booking.amount}</div>
                        <button className="receipt-btn"><i className="fa fa-file-text-o"></i> Receipt</button>
                        <button className="book-again-btn">Book Again</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="saved-section">
              <div className="section-header">
                <h2>Saved Brahmins</h2>
              </div>
              
              <div className="saved-brahmins">
                {savedBrahmins.map(brahmin => (
                  <div key={brahmin.id} className="saved-brahmin-card">
                    <img src={brahmin.image} alt={brahmin.name} className="brahmin-img" />
                    <div className="brahmin-info">
                      <h3>{brahmin.name}</h3>
                      <p>{brahmin.specialization}</p>
                      <div className="rating">
                        <span className="stars">★</span> {brahmin.rating}
                      </div>
                    </div>
                    <div className="saved-actions">
                      <button className="remove-saved-btn"><i className="fa fa-heart"></i></button>
                      <button className="view-profile-btn">View Profile</button>
                      <button className="book-now-btn">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-card">
                <h2>Personal Information</h2>
                {updateSuccess && <div className="update-success-message">{updateSuccess}</div>}
                {updateError && <div className="update-error-message">{updateError}</div>}
                <div className="profile-photo-section">
                  <h3>Profile Photo</h3>
                  <div className="profile-photo-container">
                    <img 
                      src={getImageUrl(currentUser?.profileImage)} 
                      alt={userProfile.name} 
                      className="settings-profile-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/default-avatar.png";
                      }}
                    />
                    <div className="photo-actions">
                      <button 
                        className="upload-photo-btn" 
                        onClick={handleAvatarClick}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Change Photo'}
                      </button>
                      <p className="photo-tip">JPG, PNG. Max size 5MB.</p>
                    </div>
                  </div>
                  {imageError && <div className="image-upload-error">{imageError}</div>}
                  {imageSuccess && <div className="image-upload-success">{imageSuccess}</div>}
                </div>
                <form className="settings-form" onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={userProfile.name} 
                      className="form-control" 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        defaultValue={userProfile.email} 
                        className="form-control" 
                        disabled 
                        title="Email cannot be changed"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        defaultValue={userProfile.phone} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      name="location"
                      defaultValue={userProfile.location} 
                      className="form-control" 
                    />
                  </div>
                  <button type="submit" className="get-started-button">
                    Save Changes
                  </button>
                </form>
                {updateError && <div className="update-error">{updateError}</div>}
                {updateSuccess && <div className="update-success">{updateSuccess}</div>}
              </div>
              
              {/* Rest of the settings section remains the same */}
              <div className="settings-card">
                <h2>Account Security</h2>
                <form className="settings-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" className="form-control" />
                    </div>
                  </div>
                  <button type="submit" className="get-started-button">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="danger-zone">
                <h2>Danger Zone</h2>
                <div className="danger-actions">
                  <div>
                    <h3>Delete Account</h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <button className="delete-account-btn">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YajamanProfile;