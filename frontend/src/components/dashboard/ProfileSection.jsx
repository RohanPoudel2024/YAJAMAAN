import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiCalendar, 
  FiBriefcase, 
  FiAward, 
  FiEdit2, 
  FiSave, 
  FiPlus, 
  FiX, 
  FiCheck,
  FiCamera,
  FiUpload,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { uploadProfileImage, changePassword } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProfileSection = ({ profile }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    specialization: profile?.specialization || [],
    languages: profile?.languages || [],
    experience: profile?.experience || '',
  });
  
  
  const [editing, setEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(profile?.profileImage);
  
  
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  
  const [availability, setAvailability] = useState({
    monday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { available: true, slots: [{ start: '09:00', end: '17:00' }] },
    sunday: { available: false, slots: [] }
  });

  
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        specialization: profile.specialization || [],
        languages: profile.languages || [],
        experience: profile.experience || '',
      });
      
      setPreviewImage(profile.profileImage);
      
      if (profile.availability) {
        setAvailability(profile.availability);
      }
    }
  }, [profile]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  
  const handlePhotoClick = () => {
    if (!editing) return;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    
    setPhotoError('');
    setPhotoSuccess('');
    
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Please select a JPEG or PNG image.');
      return;
    }
    
    
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size should be less than 5MB.');
      return;
    }
    
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    
    try {
      setUploadingPhoto(true);
      
      
      const formData = new FormData();
      formData.append('profileImage', file);
      
      
      const response = await uploadProfileImage(formData);
      
      if (response.success) {
        setPhotoSuccess('Profile photo updated successfully!');
        
        if (updateUserProfile) {
          updateUserProfile({ profileImage: response.imageUrl });
        }
      } else {
        setPhotoError(response.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setPhotoError('Error uploading image. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  
  const addSpecialization = () => {
    if (newSpecialization.trim() && !profileData.specialization.includes(newSpecialization.trim())) {
      setProfileData(prev => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };
  
  const removeSpecialization = (item) => {
    setProfileData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(spec => spec !== item)
    }));
  };
  
  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };
  
  const removeLanguage = (item) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== item)
    }));
  };
  
  
  const toggleDayAvailability = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        slots: prev[day].available ? [] : [{ start: '09:00', end: '17:00' }]
      }
    }));
  };
  
  const addTimeSlot = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };
  
  const removeTimeSlot = (day, index) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
  };
  
  const updateTimeSlot = (day, index, field, value) => {
    setAvailability(prev => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots
        }
      };
    });
  };
  
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    
    setPasswordError('');
    setPasswordSuccess('');
    
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    
    try {
      setChangingPassword(true);
      
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        
        setTimeout(() => {
          setPasswordModalOpen(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Error changing password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };
  
  
  const saveProfile = async () => {
    try {
      
      
      
      
      setSaveMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });
      
      
      setTimeout(() => {
        setSaveMessage({ text: '', type: '' });
      }, 5000);
      
      setEditing(false);
    } catch (error) {
      setSaveMessage({
        text: 'Error updating profile. Please try again.',
        type: 'error'
      });
    }
  };
  
  return (
    <>
      <h1 className="profile-page-title">Profile & Availability</h1>
      
      <div className="profile-actions">
        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            <FiEdit2 size={16} className="btn-icon" /> Edit Profile
          </button>
        ) : (
          <button className="btn btn-primary" onClick={saveProfile}>
            <FiSave size={16} className="btn-icon" /> Save Changes
          </button>
        )}
      </div>
      
      {saveMessage.text && (
        <div className={`save-message ${saveMessage.type}`}>
          {saveMessage.type === 'success' ? <FiCheck /> : <FiX />}
          {saveMessage.text}
        </div>
      )}
      
      <div className="profile-grid">
        <section className="profile-card">
          <div className="card-header">
            <h2><FiUser /> Personal Information</h2>
            {editing && <small>Edit your personal details</small>}
          </div>
          
          <div className="profile-content">
            <div className="profile-image-container">
              <img 
                src={previewImage || profile?.profileImage || "/def.png"}
                alt={profileData.name}
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/def.png";
                }}
                onClick={handlePhotoClick}
                style={{ cursor: editing ? 'pointer' : 'default' }}
              />
              {editing && (
                <>
                  <button 
                    className="change-photo-btn" 
                    onClick={handlePhotoClick}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? 
                      <><FiUpload size={14} className="spin" /> Uploading...</> : 
                      <><FiCamera size={14} /> Change Photo</>
                    }
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/jpg"
                    style={{ display: 'none' }} 
                  />
                  {photoError && <div className="photo-error-message">{photoError}</div>}
                  {photoSuccess && <div className="photo-success-message">{photoSuccess}</div>}
                </>
              )}
            </div>
            
            <div className="profile-fields">
              <div className="field-group">
                <label><FiUser /> Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Your full name"
                  />
                ) : (
                  <p>{profileData.name}</p>
                )}
              </div>
              
              <div className="field-group">
                <label><FiMail /> Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Your email address"
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>
              
              <div className="field-group">
                <label><FiPhone /> Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Your phone number"
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
              
              <div className="field-group">
                <label><FiMapPin /> Location</label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Your location"
                  />
                ) : (
                  <p>{profileData.location}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="profile-card">
          <div className="card-header">
            <h2><FiBriefcase /> Professional Information</h2>
            {editing && <small>Edit your professional details</small>}
          </div>
          
          <div className="profile-content">
            <div className="field-group">
              <label><FiAward /> Years of Experience</label>
              {editing ? (
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Years of experience"
                />
              ) : (
                <p>{profileData.experience}</p>
              )}
            </div>
            
            <div className="field-group">
              <label>Bio / About Me</label>
              {editing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="profile-textarea"
                  placeholder="Tell clients about yourself, your expertise and experience"
                  rows={4}
                />
              ) : (
                <p>{profileData.bio}</p>
              )}
            </div>
            
            <div className="field-group">
              <label>Specializations</label>
              <div className="tags-container">
                {profileData.specialization.map((item, index) => (
                  <div key={index} className="tag">
                    {item}
                    {editing && (
                      <button 
                        className="tag-remove"
                        onClick={() => removeSpecialization(item)}
                      >
                        <FiX size={12} />
                      </button>
                    )}
                  </div>
                ))}
                
                {editing && (
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      className="tag-input"
                      placeholder="Add specialization"
                    />
                    <button 
                      className="tag-add"
                      onClick={addSpecialization}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="field-group">
              <label>Languages</label>
              <div className="tags-container">
                {profileData.languages.map((item, index) => (
                  <div key={index} className="tag">
                    {item}
                    {editing && (
                      <button 
                        className="tag-remove"
                        onClick={() => removeLanguage(item)}
                      >
                        <FiX size={12} />
                      </button>
                    )}
                  </div>
                ))}
                
                {editing && (
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="tag-input"
                      placeholder="Add language"
                    />
                    <button 
                      className="tag-add"
                      onClick={addLanguage}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="profile-card full-width">
          <div className="card-header">
            <h2><FiCalendar /> Availability</h2>
            <small>Set your weekly availability for bookings</small>
          </div>
          
          <div className="availability-container">
            {Object.entries(availability).map(([day, dayData]) => (
              <div key={day} className="availability-day">
                <div className="day-header">
                  <div className="day-toggle">
                    <input
                      type="checkbox"
                      id={`available-${day}`}
                      checked={dayData.available}
                      onChange={() => toggleDayAvailability(day)}
                      className="toggle-checkbox"
                    />
                    <label htmlFor={`available-${day}`} className="toggle-label">
                      <span className="toggle-inner"></span>
                      <span className="toggle-switch"></span>
                    </label>
                  </div>
                  <h3 className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                </div>
                
                {dayData.available && (
                  <div className="day-slots">
                    {dayData.slots.map((slot, index) => (
                      <div key={index} className="time-slot">
                        <select
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                          className="time-select"
                        >
                          {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                            <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                              {`${hour.toString().padStart(2, '0')}:00`}
                            </option>
                          ))}
                        </select>
                        <span className="time-separator">to</span>
                        <select
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                          className="time-select"
                        >
                          {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                            <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                              {`${hour.toString().padStart(2, '0')}:00`}
                            </option>
                          ))}
                        </select>
                        {dayData.slots.length > 1 && (
                          <button 
                            className="slot-remove"
                            onClick={() => removeTimeSlot(day, index)}
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      className="add-slot-btn"
                      onClick={() => addTimeSlot(day)}
                    >
                      <FiPlus size={14} /> Add Time Slot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        <section className="profile-card">
          <div className="card-header">
            <h2><FiUser /> Account Settings</h2>
          </div>
          
          <div className="profile-content">
            <button 
              className="btn btn-outline full-width"
              onClick={() => setPasswordModalOpen(true)}
            >
              <FiLock size={16} className="btn-icon" /> Change Password
            </button>
            
            <button className="btn btn-outline full-width">
              Notification Settings
            </button>
            
            <button className="btn btn-danger full-width">
              Deactivate Account
            </button>
          </div>
        </section>
      </div>
      
      {passwordModalOpen && (
        <div className="modal-overlay">
          <div className="password-modal">
            <div className="modal-header">
              <h2><FiLock /> Change Password</h2>
              <button className="close-modal" onClick={() => setPasswordModalOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              {passwordError && (
                <div className="password-error">{passwordError}</div>
              )}
              
              {passwordSuccess && (
                <div className="password-success">{passwordSuccess}</div>
              )}
              
              <div className="password-field">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="password-input"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="password-field">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="password-input"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <small className="password-hint">Password must be at least 8 characters long</small>
              </div>
              
              <div className="password-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="password-input"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSection;