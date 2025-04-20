
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBrahminById } from '../../services/api';
import Navbar from '../Navbar';
import Footer from '../Footer';
import '../../styles/BrahminProfile.css';
import BrahminProfileView from './BrahminProfileView';

const BrahminProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [brahmin, setBrahmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBrahminProfile = async () => {
      setLoading(true);
      try {
        const result = await getBrahminById(id);
        console.log("Brahmin data:", result);
        if (result.success) {
          
          const brahminData = {
            ...result.data,
            specialization: result.data.specializations || [],
            bio: result.data.brahminDetails?.bio || "No bio available.",
            languages: result.data.brahminDetails?.languages || ["Hindi", "Nepali", "Sanskrit"],
            education: result.data.brahminDetails?.education || "Traditional Vedic Education",
            price: result.data.priceRange || "Rs. 5,000 - Rs. 25,000",
            totalReviews: result.data.reviewCount || 0,
            reviews: result.data.reviews || [],
            rituals: [
              { id: 1, name: "Wedding Ceremony", price: "Rs. 15,000", duration: "4-5 hours" },
              { id: 2, name: "Griha Pravesh", price: "Rs. 8,000", duration: "2-3 hours" },
              { id: 3, name: "Satyanarayan Puja", price: "Rs. 5,000", duration: "1-2 hours" }
            ],
            availability: {
              schedule: [
                { day: "Monday", times: ["9:00 AM - 12:00 PM", "4:00 PM - 8:00 PM"] },
                { day: "Tuesday", times: ["9:00 AM - 12:00 PM", "4:00 PM - 8:00 PM"] },
                { day: "Wednesday", times: ["9:00 AM - 12:00 PM", "4:00 PM - 8:00 PM"] },
                { day: "Thursday", times: ["9:00 AM - 12:00 PM", "4:00 PM - 8:00 PM"] },
                { day: "Friday", times: ["9:00 AM - 12:00 PM", "4:00 PM - 8:00 PM"] },
                { day: "Saturday", times: ["10:00 AM - 8:00 PM"] },
                { day: "Sunday", times: ["10:00 AM - 6:00 PM"] }
              ],
              unavailableDates: ["2024-05-15", "2024-05-16", "2024-05-30"]
            },
            certifications: result.data.brahminDetails?.certifications || ["Vedic Studies Certificate", "Traditional Purohit Training"]
          };
          setBrahmin(brahminData);
        } else {
          setError("Failed to load brahmin profile");
        }
      } catch (error) {
        console.error("Error fetching brahmin profile:", error);
        setError("Failed to load brahmin profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrahminProfile();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !brahmin) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>{error || "Brahmin not found"}</p>
          <Link to="/find-brahmin" className="btn btn-primary">Back to Search</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BrahminProfileView 
        brahmin={brahmin}
        currentUser={currentUser}
        navigate={navigate}
      />
      <Footer />
    </>
  );
};

export default BrahminProfile;