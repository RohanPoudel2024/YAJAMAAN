import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import '../../styles/dashboard.css';

const BrahminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const brahminData = {
    name: 'Pandit Ramesh Sharma',
    totalBookings: 48,
    completedRituals: 42,
    pendingApprovals: 3,
    totalEarnings: 78500,
    upcomingRituals: [
      { id: 1, ritual: 'Griha Pravesh', client: 'Suresh Mehta', date: '2023-10-18', time: '09:00 AM', address: '123 Vijay Nagar, Indore', amount: 5100 },
      { id: 2, ritual: 'Satyanarayan Puja', client: 'Priya Patel', date: '2023-10-20', time: '11:00 AM', address: '45 Scheme No. 54, Indore', amount: 3100 },
      { id: 3, ritual: 'Vivah Puja', client: 'Dinesh Agarwal', date: '2023-10-25', time: '07:30 AM', address: 'Hotel Sayaji, Indore', amount: 15000 },
    ],
    pendingRequests: [
      { id: 101, ritual: 'Mata Ki Chowki', client: 'Rajesh Kumar', date: '2023-11-02', time: '05:00 PM', address: '78 LIG Colony, Indore', amount: 4500 },
      { id: 102, ritual: 'Naamkaran', client: 'Meena Sharma', date: '2023-11-05', time: '10:00 AM', address: '34 Rajendra Nagar, Indore', amount: 2100 },
    ],
    monthlyEarnings: [
      { month: 'Apr', amount: 12000 },
      { month: 'May', amount: 9500 },
      { month: 'Jun', amount: 11000 },
      { month: 'Jul', amount: 15500 },
      { month: 'Aug', amount: 13200 },
      { month: 'Sep', amount: 17300 },
    ],
    recentReviews: [
      { id: 201, client: 'Mohit Jain', ritual: 'Griha Pravesh', rating: 5, comment: 'Very thorough and knowledgeable. Made the ceremony very special.' },
      { id: 202, client: 'Anjali Singh', ritual: 'Satyanarayan Puja', rating: 4, comment: 'Excellent service. Was punctual and performed all rituals properly.' }
    ]
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="dashboard-main">
        {activeSection === 'dashboard' && (
          <DashboardOverview brahminData={brahminData} />
        )}
        {/* Other sections would be conditionally rendered here */}
      </main>
    </div>
  );
};

export default BrahminDashboard;