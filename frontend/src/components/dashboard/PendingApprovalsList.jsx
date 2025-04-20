import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const PendingApprovalsList = ({ approvals }) => {
  if (approvals.length === 0) {
    return (
      <div className="empty-state">
        <p>No pending approval requests</p>
      </div>
    );
  }

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="approval-list">
      {approvals.map(approval => (
        <div key={approval.id} className="approval-item">
          <div className="item-content">
            <h4 className="item-title">{approval.title}</h4>
            <p className="item-client">{approval.client}</p>
            <div className="item-details">
              <span className="detail-item">
                <FiCalendar />
                {formatDate(approval.date)}
              </span>
            </div>
          </div>
          
          <div className="item-actions">
            <div className="item-amount">NPR {approval.amount}</div>
            <div className="action-buttons">
              <button className="btn-success-small">Accept</button>
              <button className="btn-danger-small">Decline</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingApprovalsList;