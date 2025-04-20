import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

const AdminUsers = ({ users = [], onUserAdded, onUserUpdated, onUserDeleted, onUserVerified }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  
  useEffect(() => {
    const handleAddUser = () => setShowAddModal(true);
    
    document.addEventListener('admin-add-user', handleAddUser);
    document.addEventListener('admin-verify-brahmins', () => setFilterRole('brahmin'));
    
    return () => {
      document.removeEventListener('admin-add-user', handleAddUser);
      document.removeEventListener('admin-verify-brahmins', () => setFilterRole('brahmin'));
    };
  }, []);
  
  
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        setDeletingId(userId);
        
        const response = await adminAPI.deleteUser(userId);
        
        if (response.success) {
          onUserDeleted(userId);
          setError('');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
        setDeletingId(null);
      }
    }
  };
  
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };
  
  const handleVerifyBrahmin = async (userId) => {
    try {
      setLoading(true);
      setVerifyingId(userId);
      
      const response = await adminAPI.verifyBrahmin(userId);
      
      if (response.success) {
        onUserVerified(userId);
        setError('');
        
        
        const verifiedUser = users.find(user => user._id === userId);
        const userName = verifiedUser ? verifiedUser.name : 'Brahmin';
        
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification success';
        toast.innerHTML = `
          <div class="toast-icon"><i class="fa fa-check-circle"></i></div>
          <div class="toast-content">
            <p class="toast-title">Brahmin Verified</p>
            <p class="toast-message">${userName} has been verified successfully</p>
          </div>
        `;
        document.body.appendChild(toast);
        
        
        setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
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

  
  useEffect(() => {
    
    const handleShowAddUserModal = () => {
      setShowAddModal(true);
    };
    
    
    const handleFilterUnverifiedBrahmins = () => {
      setFilterRole('brahmin');
      
      const unverifiedBrahmins = users.filter(
        user => user.role === 'brahmin' && !user.isVerified
      );
      
      setFilteredUsers(unverifiedBrahmins);
      
      
      const filterNote = document.createElement('div');
      filterNote.className = 'filter-note';
      filterNote.innerHTML = `<i class="fa fa-filter"></i> Showing only unverified brahmins`;
      
      
      const existingNote = document.querySelector('.filter-note');
      if (existingNote) {
        existingNote.remove();
      }
      
      
      const tableContainer = document.querySelector('.users-table-container');
      if (tableContainer) {
        tableContainer.parentNode.insertBefore(filterNote, tableContainer);
      }
    };
    
    
    document.addEventListener('show-add-user-modal', handleShowAddUserModal);
    document.addEventListener('filter-unverified-brahmins', handleFilterUnverifiedBrahmins);
    
    
    return () => {
      document.removeEventListener('show-add-user-modal', handleShowAddUserModal);
      document.removeEventListener('filter-unverified-brahmins', handleFilterUnverifiedBrahmins);
    };
  }, [users]);

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Manage Users</h1>
        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <i className="fa fa-plus"></i> Add New User
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="users-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa fa-search"></i>
        </div>
        
        <div className="role-filter">
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="yajaman">Yajaman</option>
            <option value="brahmin">Brahmin</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      
      <div className="users-table-container">
        {loading && <div className="table-loading-overlay"><div className="spinner"></div></div>}
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>{user.location || 'N/A'}</td>
                  <td>
                    {user.role === 'brahmin' && (
                      <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-icon-btn edit" 
                      onClick={() => handleEditClick(user)}
                    >
                      <i className="fa fa-pencil"></i>
                      <span className="tooltip">Edit User</span>
                    </button>
                    
                    {user.role === 'brahmin' && !user.isVerified && (
                      <button 
                        className={`action-icon-btn verify ${verifyingId === user._id ? 'loading' : ''}`} 
                        onClick={() => handleVerifyBrahmin(user._id)}
                        disabled={loading || verifyingId === user._id}
                      >
                        <i className="fa fa-check-circle"></i>
                        <span className="tooltip">Verify Brahmin</span>
                      </button>
                    )}
                    
                    <button 
                      className={`action-icon-btn delete ${deletingId === user._id ? 'loading' : ''}`} 
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={loading || deletingId === user._id}
                    >
                      <i className="fa fa-trash"></i>
                      <span className="tooltip">Delete User</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm || filterRole !== 'all' 
                    ? 'No users match your search criteria' 
                    : 'No users found in the system'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)} 
          onUserAdded={(newUser) => {
            onUserAdded(newUser);
            setShowAddModal(false);
          }}
        />
      )}
      
      {showEditModal && currentUser && (
        <EditUserModal 
          user={currentUser}
          onClose={() => {
            setShowEditModal(false);
            setCurrentUser(null);
          }} 
          onUserUpdated={(updatedUser) => {
            onUserUpdated(updatedUser);
            setShowEditModal(false);
            setCurrentUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;