import React, { useState } from 'react';
import { adminAPI } from '../../services/adminAPI';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'yajaman',
    phone: user.phone || '',
    location: user.location || '',
    specialization: user.brahminDetails?.specialization || [],
    languages: user.brahminDetails?.languages || [],
    experience: user.brahminDetails?.experience || 0,
    bio: user.brahminDetails?.bio || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location
      };
      
      
      if (formData.role === 'brahmin') {
        updateData.brahminDetails = {
          specialization: formData.specialization,
          languages: formData.languages,
          experience: Number(formData.experience),
          bio: formData.bio
        };
      }
      
      const response = await adminAPI.updateUser(user._id, updateData);
      
      if (response.success) {
        onUserUpdated(response.data);
      } else {
        setError(response.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.error || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit User</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled 
              />
              <small>Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role*</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled 
              >
                <option value="yajaman">Yajaman</option>
                <option value="brahmin">Brahmin</option>
                <option value="admin">Admin</option>
              </select>
              <small>Role cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            {formData.role === 'brahmin' && (
              <>
                <div className="form-group">
                  <label htmlFor="specialization">Specialization (comma separated)</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization.join(', ')}
                    onChange={handleArrayChange}
                    placeholder="e.g. Wedding, Griha Pravesh, Satyanarayan Puja"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="languages">Languages (comma separated)</label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={formData.languages.join(', ')}
                    onChange={handleArrayChange}
                    placeholder="e.g. Hindi, Sanskrit, English"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Experience (years)</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
              </>
            )}
          </form>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;