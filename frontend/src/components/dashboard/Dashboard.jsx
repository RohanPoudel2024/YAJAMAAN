import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import BookingsSection from './BookingsSection';
import EarningsSection from './EarningsSection';
import CalendarSection from './CalendarSection';
import ProfileSection from './ProfileSection';
import ReviewsSection from './ReviewsSection';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [brahminData, setBrahminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    
    if (currentUser && currentUser.role !== 'brahmin' && currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        
        const mockData = {
          totalBookings: 48,
          completedRituals: 42,
          pendingApprovals: 3,
          totalEarnings: 78500,
          upcomingRituals: [
            { id: 1, ritual: 'Griha Pravesh', client: 'Suresh Mehta', date: '2025-04-18', time: '09:00 AM', address: '123 Vijay Nagar, Kathmandu', amount: 5100 },
            { id: 2, ritual: 'Satyanarayan Puja', client: 'Priya Patel', date: '2025-04-20', time: '11:00 AM', address: '45 Scheme No. 54, Lalitpur', amount: 3100 },
            { id: 3, ritual: 'Vivah Puja', client: 'Dinesh Agarwal', date: '2025-04-25', time: '07:30 AM', address: 'Hotel Sayaji, Bhaktapur', amount: 15000 },
          ],
          pendingRequests: [
            { id: 101, title: 'Mata Ki Chowki', client: 'Rajesh Kumar', date: '2025-05-02', status: 'Waiting Confirmation', amount: 4500 },
            { id: 102, title: 'Naamkaran', client: 'Meena Sharma', date: '2025-05-05', status: 'Pending Details', amount: 2100 },
          ],
          monthlyEarnings: [
            { month: 'Oct', earnings: 65000 },
            { month: 'Nov', earnings: 72000 },
            { month: 'Dec', earnings: 68000 },
            { month: 'Jan', earnings: 75000 },
            { month: 'Feb', earnings: 80000 },
            { month: 'Mar', earnings: 85000 }
          ],
          recentReviews: [
            { id: 201, client: 'Shrestha Family', ritual: 'Griha Pravesh', rating: 5, comment: 'Excellent service. Very professional and knowledgeable.' },
            { id: 202, client: 'Mr. Kumar', ritual: 'Satyanarayan Puja', rating: 4, comment: 'Good service, would recommend.' }
          ],
          
          profile: {
            name: currentUser?.name || 'Pandit Sharma',
            email: currentUser?.email || 'pandit@example.com',
            phone: currentUser?.phone || '+977 9876543210',
            location: currentUser?.location || 'Kathmandu',
            specialization: currentUser?.brahminDetails?.specialization || ['Wedding Ceremonies', 'Griha Pravesh'],
            experience: currentUser?.brahminDetails?.experience || '15+ years',
            bio: currentUser?.brahminDetails?.bio || 'Traditional Vedic Brahmin with extensive experience in various rituals and ceremonies.'
          }
        };
        
        setBrahminData(mockData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      );
    }

    switch (activeSection) {
      case 'bookings':
        return <BookingsSection bookings={brahminData?.upcomingRituals || []} />;
      case 'earnings':
        return <EarningsSection earnings={brahminData?.monthlyEarnings || []} totalEarnings={brahminData?.totalEarnings || 0} />;
      case 'calendar':
        return <CalendarSection rituals={brahminData?.upcomingRituals || []} />;
      case 'profile':
        return <ProfileSection profile={brahminData?.profile || {}} />;
      case 'reviews':
        return <ReviewsSection reviews={brahminData?.recentReviews || []} />;
      default:
        return <DashboardOverview brahminData={brahminData} />;
    }
  };

  return (
    <div className="dashboard-container dashboard-reset">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;