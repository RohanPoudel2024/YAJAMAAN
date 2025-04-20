import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBrahmins } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import Navbar from '../Navbar';
import '../../styles/BrahminSearch.css';

const BrahminSearch = () => {
  const { currentUser } = useAuth();
  const [brahmins, setBrahmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    ritual: '',
    rating: 0,
    date: ''
  });

  
  const districts = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Kavre", "Makwanpur", "Chitwan",
    "Dhading", "Nuwakot", "Sindhupalchok", "Dolakha", "Ramechhap", "Sindhuli", "Morang"
    
  ];

  
  const ritualTypes = [
    "Wedding Ceremony", "Griha Pravesh", "Satyanarayan Puja", 
    "Baby Naming Ceremony", "Thread Ceremony", "Funeral Rites",
    "Birthday Ceremony", "Festival Rituals"
  ];

  useEffect(() => {
    
    fetchBrahmins().catch(err => {
      console.error("Failed to fetch brahmins:", err);
      setError("An error occurred while loading brahmins. Please try again.");
      setLoading(false);
    });
  }, []); 

  useEffect(() => {
    console.log("API URL from env:", process.env.REACT_APP_API_URL);
  }, []);

  
  const fetchBrahmins = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getBrahmins(filters);
      console.log('Search result:', result);
      
      if (result.success) {
        setBrahmins(result.data || []);
      } else {
        setError(result.error || 'Failed to load brahmins');
      }
    } catch (error) {
      console.error("Error fetching brahmins:", error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const retryFetchBrahmins = async () => {
    setLoading(true);
    setError('');
    
    try {
      
      const result = await getBrahmins({});
      
      if (result.success) {
        setBrahmins(result.data || []);
        
        setFilters({
          location: '',
          ritual: '',
          rating: 0,
          date: ''
        });
      } else {
        setError('Still unable to load brahmins. Please check your connection.');
      }
    } catch (error) {
      setError('Server might be unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBrahmins();
  };

  
  const formatExperience = (years) => {
    return `${years} ${years === 1 ? 'year' : 'years'} experience`;
  };

  
  const getBadgeClass = (isAvailable) => {
    return isAvailable ? "availability-badge" : "availability-badge limited";
  };

  
  const fallbackImage = "https://via.placeholder.com/150";

  return (
    <div className="page-container">
      <Navbar />
      <div className="brahmin-search-container">
        <h1>Find the Perfect Brahmin</h1>
        <p className="search-description">Search for qualified Brahmins for your ritual needs</p>
        
        <form onSubmit={handleSearch} className="search-filters">
          <div className="filter-grid">
            <div className="filter-item">
              <label htmlFor="location">Location</label>
              <select 
                id="location"
                name="location" 
                value={filters.location}
                onChange={handleFilterChange}
                aria-label="Select location"
              >
                <option value="">Any Location</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-item">
              <label htmlFor="ritual">Ritual Type</label>
              <select 
                id="ritual"
                name="ritual" 
                value={filters.ritual}
                onChange={handleFilterChange}
                aria-label="Select ritual type"
              >
                <option value="">Any Ritual</option>
                {ritualTypes.map((ritual, index) => (
                  <option key={index} value={ritual}>{ritual}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-item">
              <label htmlFor="date">Date Needed</label>
              <input 
                id="date"
                type="date" 
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                min={new Date().toISOString().split('T')[0]}
                aria-label="Select date"
              />
            </div>
            
            <div className="filter-item">
              <label htmlFor="rating">Minimum Rating</label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                aria-label="Select minimum rating"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            
            <div className="filter-submit">
              <button type="submit" className="search-btn" aria-label="Search Brahmins">
                Search Brahmins
              </button>
            </div>
          </div>
        </form>

        <div className="brahmin-results">
          {loading ? (
            <div className="loading-spinner" aria-live="polite">
              <div className="spinner" aria-hidden="true"></div>
              <p>Finding the perfect Brahmins for you...</p>
            </div>
          ) : error ? (
            <div className="error-message" aria-live="assertive">
              <p>{error}</p>
              <button onClick={retryFetchBrahmins} aria-label="Try Again">Try Again</button>
            </div>
          ) : brahmins.length === 0 ? (
            <div className="no-results" aria-live="polite">
              <h3>No Brahmins Found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="results-grid">
              {brahmins.map(brahmin => (
                <div key={brahmin._id} className="brahmin-card">
                  <div className="brahmin-image">
                    <img 
                      src={getImageUrl(brahmin.profileImage)}
                      alt={brahmin.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/def.png";
                      }}
                    />
                    <div className={`availability-badge ${brahmin.isAvailable ? '' : 'limited'}`}>
                      {brahmin.isAvailable ? 'Available' : 'Limited Availability'}
                    </div>
                  </div>
                  <div className="brahmin-info">
                    <h3>{brahmin.name}</h3>
                    <div className="brahmin-location">
                      <i className="icon-location" aria-hidden="true">📍</i> {brahmin.location}
                    </div>
                    <div className="brahmin-rating">
                      <span className="stars" aria-hidden="true">
                        {'★'.repeat(Math.floor(brahmin.rating || 0))}
                        {'☆'.repeat(5-Math.floor(brahmin.rating || 0))}
                      </span>
                      <span className="rating-value">{brahmin.rating?.toFixed(1) || "New"}</span>
                      {brahmin.reviewCount > 0 && (
                        <span className="review-count">({brahmin.reviewCount} reviews)</span>
                      )}
                    </div>
                    <div className="specialization-tags">
                      {brahmin.specializations && brahmin.specializations.slice(0, 3).map((spec, i) => (
                        <span key={i} className="tag">{spec}</span>
                      ))}
                      {brahmin.specializations && brahmin.specializations.length > 3 && (
                        <span className="tag">+{brahmin.specializations.length - 3} more</span>
                      )}
                    </div>
                    <div className="brahmin-details">
                      <span><i className="icon-experience" aria-hidden="true">⏳</i> {formatExperience(brahmin.experience || 0)}</span>
                      <span><i className="icon-price" aria-hidden="true">💰</i> {brahmin.priceRange || "Price varies"}</span>
                    </div>
                    <div className="brahmin-actions">
                      <Link to={`/brahmin/${brahmin._id}`} className="btn btn-view-profile">View Profile</Link>
                      <Link to={`/book/${brahmin._id}`} className="btn btn-book-now">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrahminSearch;