import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/helpers';
import styles from '../../styles/BrahminProfileView.module.css';

const BrahminProfileView = ({ brahmin, currentUser, navigate }) => {
  const [activeTab, setActiveTab] = useState('about');

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/brahmin/${brahmin._id}` } });
      return;
    }
    navigate(`/book/${brahmin._id}`);
  };

  const handleSaveBrahmin = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/brahmin/${brahmin._id}` } });
      return;
    }
    
    alert('Brahmin saved to your favorites!');
  };

  return (
    <div className={styles.brahminProfileView}>
      {/* Back Navigation */}
      <Link to="/find-brahmin" className={styles.backLink}>
        <i className="fa fa-arrow-left"></i> Back to Search
      </Link>

      {/* Profile Hero Section */}
      <div className={styles.profileHero}>
        <div className={styles.profileMain}>
          <div className={styles.profileImage}>
            <img 
              src={getImageUrl(brahmin.profileImage)} 
              alt={brahmin.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/def.png";
              }}
            />
            {brahmin.isAvailable ? (
              <span className={`${styles.availabilityBadge} ${styles.available}`}>Available</span>
            ) : (
              <span className={`${styles.availabilityBadge} ${styles.limited}`}>Limited Availability</span>
            )}
          </div>
          
          <div className={styles.profileInfo}>
            <h1>{brahmin.name}</h1>
            
            <div className={styles.profileMeta}>
              <div className={styles.metaItem}>
                <i className="fa fa-map-marker"></i> {brahmin.location}
              </div>
              <div className={styles.metaItem}>
                <i className="fa fa-clock-o"></i> {brahmin.experience || 0} years experience
              </div>
            </div>
            
            <div className={styles.ratingInfo}>
              <div className={styles.stars}>
                {'★'.repeat(Math.floor(brahmin.rating || 0))}
                {'☆'.repeat(5-Math.floor(brahmin.rating || 0))}
              </div>
              <span className={styles.ratingValue}>{brahmin.rating?.toFixed(1) || "New"}</span>
              <span className={styles.reviewsCount}>({brahmin.totalReviews} reviews)</span>
            </div>
            
            <div className={styles.specializationTags}>
              {brahmin.specialization.slice(0, 4).map((spec, i) => (
                <span key={i} className={styles.tag}>{spec}</span>
              ))}
            </div>
            
            <div className={styles.priceRange}>
              <i className="fa fa-money"></i> Price Range: {brahmin.price}
            </div>
            
            <div className={styles.profileActions}>
              <button onClick={handleBookNow} className={`${styles.btn} ${styles.btnBook}`}>
                <i className="fa fa-calendar-check-o"></i> Book Now
              </button>
              <button onClick={handleSaveBrahmin} className={`${styles.btn} ${styles.btnSave}`}>
                <i className="fa fa-heart-o"></i> Save
              </button>
              <a href={`tel:${brahmin.phone}`} className={`${styles.btn} ${styles.btnContact}`}>
                <i className="fa fa-phone"></i> Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.profileTabs}>
        {['about', 'rituals', 'reviews', 'availability'].map((tab) => (
          <button 
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`} 
            onClick={() => setActiveTab(tab)}
          >
            <i className={`fa fa-${
              tab === 'about' ? 'user' : 
              tab === 'rituals' ? 'om' : 
              tab === 'reviews' ? 'star' : 'calendar'
            }`}></i> 
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className={styles.profileContent}>
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className={styles.aboutSection}>
            <div className={styles.bioSection}>
              <h2>About {brahmin.name}</h2>
              <p className={styles.sectionDescription}>{brahmin.bio}</p>
            </div>
            
            <div className={styles.detailsSection}>
              <div className={styles.detailCard}>
                <h3><i className="fa fa-language"></i> Languages</h3>
                <p>{brahmin.languages.join(', ')}</p>
              </div>
              
              <div className={styles.detailCard}>
                <h3><i className="fa fa-graduation-cap"></i> Education</h3>
                <p>{brahmin.education}</p>
              </div>
              
              <div className={styles.detailCard}>
                <h3><i className="fa fa-certificate"></i> Certifications</h3>
                <ul className={styles.certificationsList}>
                  {brahmin.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.detailCard}>
                <h3><i className="fa fa-id-card"></i> Contact Information</h3>
                <p><i className="fa fa-envelope"></i> Email: {brahmin.email}</p>
                <p><i className="fa fa-phone"></i> Phone: {brahmin.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rituals Tab */}
        {activeTab === 'rituals' && (
          <div className={styles.ritualsSection}>
            <h2>Rituals & Ceremonies</h2>
            <p className={styles.sectionDescription}>
              Book any of these rituals directly or contact for custom ceremonies
            </p>
            
            <div className={styles.ritualsList}>
              {brahmin.rituals.map(ritual => (
                <div key={ritual.id} className={styles.ritualCard}>
                  <h3>{ritual.name}</h3>
                  <div className={styles.ritualDetails}>
                    <div className={styles.ritualMeta}>
                      <p><i className="fa fa-money"></i> Price: {ritual.price}</p>
                      <p><i className="fa fa-clock-o"></i> Duration: {ritual.duration}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/book/${brahmin._id}?ritual=${ritual.id}`)} 
                      className={styles.btnSm}
                    >
                      Book This Ritual
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.customRequest}>
              <h3>Need a custom ritual?</h3>
              <p>Contact directly to discuss your specific requirements</p>
              <button onClick={handleBookNow} className={styles.btnOutline}>
                Request Custom Ritual
              </button>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className={styles.reviewsSection}>
            <h2>Client Reviews</h2>
            
            <div className={styles.reviewsSummary}>
              <div className={styles.ratingSummary}>
                <div className={styles.largeRating}>{brahmin.rating?.toFixed(1) || "N/A"}</div>
                <div className={styles.largeStars}>
                  {'★'.repeat(Math.floor(brahmin.rating || 0))}
                  {'☆'.repeat(5-Math.floor(brahmin.rating || 0))}
                </div>
                <div className={styles.reviewsCount}>{brahmin.totalReviews} reviews</div>
              </div>
              
              <div className={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className={styles.ratingBar}>
                    <span className={styles.ratingLabel}>{rating}★</span>
                    <div className={styles.barContainer}>
                      <div className={styles.bar} style={{
                        width: rating === 5 ? '70%' :
                               rating === 4 ? '20%' :
                               rating === 3 ? '7%' :
                               rating === 2 ? '2%' : '1%'
                      }}></div>
                    </div>
                    <span className={styles.count}>
                      {rating === 5 ? '70%' :
                       rating === 4 ? '20%' :
                       rating === 3 ? '7%' :
                       rating === 2 ? '2%' : '1%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {brahmin.reviews && brahmin.reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {brahmin.reviews.map(review => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <span className={styles.reviewerName}>{review.user}</span>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                      <div className={styles.reviewRating}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noReviews}>
                <p>No reviews yet. Be the first to book and leave a review!</p>
              </div>
            )}
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className={styles.availabilitySection}>
            <h2>Availability Schedule</h2>
            <p className={styles.availabilityNote}>
              Schedule a ritual during these available times or contact directly for special arrangements
            </p>
            
            <div className={styles.weeklySchedule}>
              <h3><i className="fa fa-calendar"></i> Weekly Schedule</h3>
              <div className={styles.scheduleGrid}>
                {brahmin.availability.schedule.map((day, index) => (
                  <div key={index} className={styles.daySchedule}>
                    <h4>{day.day}</h4>
                    <div className={styles.timeSlots}>
                      {day.times.map((time, i) => (
                        <span key={i} className={styles.timeSlot}>{time}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.unavailableDates}>
              <h3><i className="fa fa-ban"></i> Unavailable Dates</h3>
              <p>The Brahmin is not available on these dates:</p>
              <div className={styles.datesList}>
                {brahmin.availability.unavailableDates.map((date, index) => (
                  <span key={index} className={styles.unavailableDate}>{date}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.bookingCta}>
              <h3>Ready to book?</h3>
              <button onClick={handleBookNow} className={styles.btnBookLarge}>
                Schedule a Ritual Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrahminProfileView;