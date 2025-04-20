import React from 'react';

const BookingsSection = ({ bookings = [] }) => {
  return (
    <div className="dashboard-section bookings-section">
      <header className="dashboard-header">
        <h1>Bookings</h1>
      </header>
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-info">
                <h3>{booking.title}</h3>
                <p>{booking.date} • {booking.time}</p>
                <p>Client: {booking.client}</p>
              </div>
              <div className="booking-actions">
                <button className="btn btn-small">Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
