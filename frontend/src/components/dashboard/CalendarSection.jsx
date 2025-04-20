import React from 'react';

const CalendarSection = ({ data = { upcomingRituals: [] } }) => {
  if (!data || !data.upcomingRituals) {
    return (
      <div className="dashboard-section calendar-section">
        <header className="dashboard-header">
          <h1>Calendar & Upcoming Rituals</h1>
        </header>
        <p>No upcoming rituals available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section calendar-section">
      <header className="dashboard-header">
        <h1>Calendar & Upcoming Rituals</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <span className="icon calendar"></span> Set Availability
          </button>
        </div>
      </header>
      <div className="calendar-container">
        {/* Calendar implementation goes here */}
        <div className="calendar-placeholder">
          <h3>March 2025</h3>
          <div className="calendar-grid">
            {/* Example calendar grid */}
          </div>
        </div>
      </div>
      <div className="upcoming-rituals">
        <h2>Upcoming Rituals</h2>
        <div className="rituals-list">
          {data.upcomingRituals.map(ritual => (
            <div key={ritual.id} className="ritual-card">
              <div className="ritual-date">
                <span className="day">{new Date(ritual.date).getDate()}</span>
                <span className="month">{new Date(ritual.date).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="ritual-info">
                <h3>{ritual.ritualName}</h3>
                <p>{ritual.time}</p>
                <p>Client: {ritual.client}</p>
              </div>
              <div className="ritual-actions">
                <button className="btn btn-small">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
