import React from 'react';

const ReviewsSection = ({ data = { recentReviews: [] } }) => {
  if (!data || !data.recentReviews) {
    return (
      <div className="dashboard-section reviews-section">
        <header className="dashboard-header">
          <h1>Customer Reviews</h1>
        </header>
        <p>No reviews available</p>
      </div>
    );
  }

  const totalReviews = data.recentReviews.length;
  const averageRating = data.recentReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;
  const roundedRating = Math.round(averageRating * 10) / 10;

  return (
    <div className="dashboard-section reviews-section">
      <header className="dashboard-header">
        <h1>Customer Reviews</h1>
        <div className="header-actions">
          <select className="filter-select">
            <option>All Time</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </header>
      <div className="reviews-summary">
        <div className="overall-rating">
          <h2>Overall Rating</h2>
          <div className="rating-display">
            <span className="rating-number">{roundedRating}</span>
            <div className="rating-stars">
              {'★'.repeat(Math.floor(roundedRating))}{'★☆'.slice(0, roundedRating % 1)}{'☆'.repeat(5 - Math.ceil(roundedRating))}
            </div>
            <span className="total-reviews">{totalReviews} reviews</span>
          </div>
        </div>
        <div className="rating-breakdown">
          <div className="breakdown-item">
            <span>5 ★</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '80%' }}></div>
            </div>
            <span>80%</span>
          </div>
          <div className="breakdown-item">
            <span>4 ★</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '15%' }}></div>
            </div>
            <span>15%</span>
          </div>
          <div className="breakdown-item">
            <span>3 ★</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '5%' }}></div>
            </div>
            <span>5%</span>
          </div>
          <div className="breakdown-item">
            <span>2 ★</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '0%' }}></div>
            </div>
            <span>0%</span>
          </div>
          <div className="breakdown-item">
            <span>1 ★</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '0%' }}></div>
            </div>
            <span>0%</span>
          </div>
        </div>
      </div>
      <div className="reviews-list">
        {data.recentReviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="client-info">
                <h4>{review.client}</h4>
                <p>{review.ritual}</p>
                <p className="review-date">March 15, 2025</p>
              </div>
              <div className="rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            {review.response && (
              <div className="review-response">
                <h5>Your Response:</h5>
                <p>{review.response}</p>
              </div>
            )}
            {!review.response && (
              <button className="btn btn-outline">
                <span className="icon reply"></span> Respond
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
