import React from 'react';
import { FiClock, FiMapPin } from 'react-icons/fi';

const UpcomingRitualsList = ({ rituals }) => {
  if (rituals.length === 0) {
    return (
      <div className="empty-state">
        <p>No upcoming rituals scheduled</p>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' })
    };
  };

  return (
    <div className="ritual-list">
      {rituals.map(ritual => {
        const formattedDate = formatDate(ritual.date);
        
        return (
          <div key={ritual.id} className="ritual-item">
            <div className="ritual-date">
              <span className="day">{formattedDate.day}</span>
              <span className="month">{formattedDate.month}</span>
            </div>
            
            <div className="item-content">
              <h4 className="item-title">{ritual.title}</h4>
              <p className="item-client">{ritual.client}</p>
              <div className="item-details">
                <span className="detail-item">
                  <FiClock />
                  {ritual.time}
                </span>
                <span className="detail-item">
                  <FiMapPin />
                  {ritual.location}
                </span>
              </div>
            </div>
            
            <div className="item-actions">
              <div className="item-amount">NPR {ritual.amount}</div>
              <button className="btn btn-outline-small">View</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingRitualsList;