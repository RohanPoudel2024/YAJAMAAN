
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookingForm.css'; 

const BookingForm = () => {
  const { brahminId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [brahminDetails, setBrahminDetails] = useState(null);
  const [ritualTypes, setRitualTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [bookingDetails, setBookingDetails] = useState({
    ritualType: '',
    date: '',
    time: '',
    location: '',
    additionalNotes: '',
    numberOfPeople: 1
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchBrahminDetails = async () => {
      setLoading(true);
      try {
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        
        const mockBrahmin = {
          id: parseInt(brahminId),
          name: "Pandit Ramesh Sharma",
          rituals: [
            { id: 1, name: "Wedding Ceremony", price: "Rs. 15,000", duration: "4-5 hours" },
            { id: 2, name: "Griha Pravesh", price: "Rs. 8,000", duration: "2-3 hours" },
            { id: 3, name: "Satyanarayan Puja", price: "Rs. 5,000", duration: "1-2 hours" }
          ]
        };
        
        setBrahminDetails(mockBrahmin);
        setRitualTypes(mockBrahmin.rituals.map(r => r.name));
      } catch (error) {
        console.error("Error fetching brahmin details:", error);
        setError("Failed to load brahmin details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrahminDetails();
  }, [brahminId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      alert(`Booking request sent to ${brahminDetails.name} for ${bookingDetails.ritualType} on ${bookingDetails.date} at ${bookingDetails.time}`);
      
      
      navigate('/whats-today');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="booking-form-container">
      <h2>Book Ritual with {brahminDetails?.name}</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="ritualType">Ritual Type</label>
          <select 
            id="ritualType"
            name="ritualType"
            value={bookingDetails.ritualType}
            onChange={handleChange}
            required
          >
            <option value="">Select Ritual Type</option>
            {ritualTypes.map((ritual, index) => (
              <option key={index} value={ritual}>{ritual}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input 
              type="date"
              id="date"
              name="date"
              value={bookingDetails.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input 
              type="time"
              id="time"
              name="time"
              value={bookingDetails.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text"
            id="location"
            name="location"
            value={bookingDetails.location}
            onChange={handleChange}
            placeholder="Enter complete address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="numberOfPeople">Number of People</label>
          <input 
            type="number"
            id="numberOfPeople"
            name="numberOfPeople"
            min="1"
            max="100"
            value={bookingDetails.numberOfPeople}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={bookingDetails.additionalNotes}
            onChange={handleChange}
            placeholder="Any specific requirements or information..."
            rows="4"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Request Booking'}
        </button>
      </form>
      
      <div className="booking-info">
        <h3>Important Information</h3>
        <ul>
          <li>Booking is subject to Brahmin's confirmation</li>
          <li>You will be notified once the Brahmin accepts your request</li>
          <li>Payment will be processed after confirmation</li>
          <li>Please be ready 15 minutes before the scheduled time</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingForm;