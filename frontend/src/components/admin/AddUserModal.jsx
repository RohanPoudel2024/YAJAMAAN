import React, { useState } from 'react';
import { adminAPI } from '../../services/adminAPI';

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'yajaman',
    phone: '',
    location: '',
    specialization: [],
    languages: [],
    experience: 0,
    bio: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.addUser(formData);
      
      if (response.success) {
        
        setSuccess('User added successfully!');
        
        
        setTimeout(() => {
          onUserAdded(response.data);
          
          const toast = document.createElement('div');
          toast.className = 'toast-notification success';
          toast.innerHTML = `
            <div class="toast-icon"><i class="fa fa-check-circle"></i></div>
            <div class="toast-content">
              <p class="toast-title">User Added</p>
              <p class="toast-message">${formData.name} has been added as a ${formData.role}</p>
            </div>
          `;
          document.body.appendChild(toast);
          
          
          setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
              document.body.removeChild(toast);
            }, 300);
          }, 5000);
        }, 1000);
      } else {
        setError(response.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error.response?.data?.error || 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New User</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role*</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="yajaman">Yajaman</option>
                <option value="brahmin">Brahmin</option>
                <option value="admin">Admin</option>
              </select>
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
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;