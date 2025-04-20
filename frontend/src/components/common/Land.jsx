import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from './Calendar';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { useAuth } from '../../context/AuthContext';
import { getBrahmins } from '../../services/api';
import { FiStar, FiMapPin, FiAward, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import '../../styles/Land.css';

const Land = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRitual, setSelectedRitual] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [registeredBrahmins, setRegisteredBrahmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Example data for rituals
  const rituals = [
    {
      id: 1,
      name: "Griha Pravesh",
      description: "House warming ceremony",
      duration: "2-3 hours",
      icon: "🏠"
    },
    {
      id: 2,
      name: "Vivah",
      description: "Traditional wedding ceremony",
      duration: "4-6 hours",
      icon: "💑"
    },
    {
      id: 3,
      name: "Upanayana",
      description: "Sacred thread ceremony",
      duration: "2-4 hours",
      icon: "🧵"
    },
    {
      id: 4,
      name: "Satyanarayan Puja",
      description: "Lord Vishnu worship ceremony",
      duration: "1-2 hours",
      icon: "🙏"
    }
  ];

  // Fetch registered brahmins
  useEffect(() => {
    const fetchBrahmins = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getBrahmins();
        
        if (result.success && result.data) {
          // Limiting to 6 brahmins for the landing page
          setRegisteredBrahmins(result.data.slice(0, 6));
        } else {
          setError('Failed to load brahmins. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching brahmins:', err);
        setError('An error occurred while fetching brahmin data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrahmins();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const formatExperience = (years) => {
    if (!years) return 'New';
    return `${years} ${years === 1 ? 'year' : 'years'} experience`;
  };

  return (
    <div className="landing-page">
      <Navbar />
      
      <div className="landing-content">
        <h1 className="welcome-heading">Welcome {currentUser?.name}</h1>
        
        {/* User action cards based on role */}
        {currentUser?.role === 'yajaman' ? (
          <div className="action-cards">
            <div className="action-card">
              <h3>Find a Brahmin</h3>
              <p>Search for qualified Brahmins based on your needs</p>
              <Link to="/find-brahmin" className="btn btn-primary">Find Now</Link>
            </div>
            
            <div className="action-card">
              <h3>My Bookings</h3>
              <p>View and manage your upcoming and past rituals</p>
              <Link to="/my-bookings" className="btn btn-secondary">View Bookings</Link>
            </div>
          </div>
        ) : (
          <div className="action-cards">
            <div className="action-card">
              <h3>Manage Bookings</h3>
              <p>View and respond to booking requests</p>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
            
            <div className="action-card">
              <h3>Update Availability</h3>
              <p>Set your available dates and times</p>
              <Link to="/dashboard/calendar" className="btn btn-secondary">Update Calendar</Link>
            </div>
          </div>
        )}

        {/* Hero Section with Search */}
        <div className="hero-section">
          <div className="welcome-banner">
            <h1>Yajaman</h1>
            <p>Find and book verified Brahmins for your sacred ceremonies</p>
            
            {/* Integrated Search in Hero Section */}
            <div className="search-container">
              <div className="search-filters">
                <input 
                  type="text" 
                  placeholder="Search Brahmins or rituals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
                <select 
                  value={selectedRitual}
                  onChange={(e) => setSelectedRitual(e.target.value)}
                  className="ritual-select"
                >
                  <option value="">Select Ritual Type</option>
                  {rituals.map(ritual => (
                    <option key={ritual.id} value={ritual.id}>
                      {ritual.icon} {ritual.name}
                    </option>
                  ))}
                </select>
                
                <Link to="/find-brahmin" className="search-btn">
                  Find Brahmins
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Rituals Section */}
        <section className="rituals-section">
          <div className="section-header">
            <h2>Popular Rituals</h2>
            <Link to="/rituals" className="view-all-btn">View All</Link>
          </div>
          <div className="ritual-cards">
            {rituals.map(ritual => (
              <div key={ritual.id} className="ritual-card">
                <span className="ritual-icon">{ritual.icon}</span>
                <h3>{ritual.name}</h3>
                <p>{ritual.description}</p>
                <span className="duration"><FiCalendar /> {ritual.duration}</span>
                <Link to={`/rituals/${ritual.id}`} className="explore-btn">Learn More</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Calendar Section */}
        <section className="availability-section">
          <div className="section-header">
            <h2>Check Availability</h2>
            <p>Select a date to see available Brahmins</p>
          </div>
          <div className="calendar-section">
            <Calendar onDateSelect={handleDateSelect} />
            {selectedDate && (
              <div className="selected-date-info">
                <p>Selected: {selectedDate.toLocaleDateString()}</p>
                <Link to={`/find-brahmin?date=${selectedDate.toISOString().split('T')[0]}`} className="view-available-btn">
                  View Available Brahmins
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Registered Brahmins Section */}
        <section className="brahmins-section">
          <div className="section-header">
            <h2>Our Registered Brahmins</h2>
            <Link to="/find-brahmin" className="view-all-btn">View All</Link>
          </div>
          
          {loading ? (
            <div className="brahmin-loading">
              <div className="loading-spinner"></div>
              <p>Loading brahmin profiles...</p>
            </div>
          ) : error ? (
            <div className="brahmin-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">Try Again</button>
            </div>
          ) : (
            <div className="brahmin-cards">
              {registeredBrahmins.map(brahmin => (
                <div key={brahmin._id} className="brahmin-card">
                  <div className="brahmin-header">
                    <div className="brahmin-avatar-container">
                      <img 
                        src={brahmin.profileImage || "/def.png"} 
                        alt={brahmin.name} 
                        className="brahmin-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/def.png";
                        }} 
                      />
                      {brahmin.isVerified && (
                        <div className="verified-badge" title="Verified Brahmin">
                          <FiCheckCircle />
                        </div>
                      )}
                    </div>
                    
                    <div className="brahmin-info">
                      <h3>{brahmin.name}</h3>
                      <div className="brahmin-location">
                        <FiMapPin /> {brahmin.location || 'Location not specified'}
                      </div>
                      <div className="brahmin-rating">
                        <FiStar className="star-icon" />
                        <span>{brahmin.rating || 0}</span>
                        <span className="reviews">({brahmin.reviewCount || 0} reviews)</span>
                      </div>
                      
                      <div className="expertise-tags">
                        {brahmin.specializations && brahmin.specializations.slice(0, 3).map((spec, i) => (
                          <span key={i} className="tag">{spec}</span>
                        ))}
                        {brahmin.specializations && brahmin.specializations.length > 3 && (
                          <span className="tag more-tag">+{brahmin.specializations.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="brahmin-details">
                    <div className="detail-item">
                      <FiAward />
                      <span>{formatExperience(brahmin.experience)}</span>
                    </div>
                    <div className="availability">
                      <FiCalendar />
                      <span>{brahmin.isAvailable ? 'Available Today' : 'Check Availability'}</span>
                    </div>
                  </div>
                  
                  <div className="brahmin-footer">
                    <span className="price-range">{brahmin.priceRange || 'Pricing varies'}</span>
                    <div className="brahmin-actions">
                      <Link to={`/brahmin/${brahmin._id}`} className="view-profile-btn">
                        View Profile
                      </Link>
                      <Link to={`/book/${brahmin._id}`} className="book-now-btn">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2>What Our Users Say</h2>
          </div>
          <div className="testimonial-container">
            <div className="testimonial">
              <div className="quote">"Yajaman made finding the right Brahmin for our wedding ceremony so easy. Highly recommended!"</div>
              <div className="author">- Sita & Ram, Pokhara</div>
            </div>
            <div className="testimonial">
              <div className="quote">"The platform is user-friendly and the verification process gives peace of mind."</div>
              <div className="author">- Aarav Patel, Kathmandu</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>How Yajaman Works</h2>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Browse our selection of verified Brahmins or search for specific ritual types</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book</h3>
              <p>Select your preferred date and time and confirm your booking</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Perform</h3>
              <p>Experience a sacred and authentic ritual with your selected Brahmin</p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Land;