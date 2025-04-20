import React from 'react';
import MetricCard from './MetricCard';
import UpcomingRitualsList from './UpcomingRitualsList';
import PendingApprovalsList from './PendingApprovalsList';
import EarningsSummaryChart from './EarningsSummaryChart';
import '../../styles/dashboard.css';

const DashboardOverview = ({ brahminData }) => {
  
  const defaultData = {
    totalBookings: 0,
    completedRituals: 0,
    pendingApprovals: 0,
    totalEarnings: 0,
    upcomingRituals: [],
    pendingRequests: [],
    monthlyEarnings: [],
    recentReviews: []
  };

  
  const data = brahminData || defaultData;

  return (
    <div className="dashboard-section">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <span className="icon calendar"></span> Set Availability
          </button>
          <button className="btn btn-primary">
            <span className="icon"></span> Add New Service
          </button>
        </div>
      </header>

      <div className="metrics-grid">
        <MetricCard 
          title="Total Bookings" 
          value={data.totalBookings} 
          iconClass="metric-icon bookings"
          trend="+12% from last month"
          isPositive={true}
        />
        <MetricCard 
          title="Completed Rituals" 
          value={data.completedRituals} 
          iconClass="metric-icon completed"
          trend="+8% from last month"
          isPositive={true}
        />
        <MetricCard 
          title="Pending Approvals" 
          value={data.pendingApprovals} 
          iconClass="metric-icon pending"
          trend="Action needed"
          isAlert={data.pendingApprovals > 0}
        />
        <MetricCard 
          title="Total Earnings" 
          value={`NPR ${data.totalEarnings}`} 
          iconClass="metric-icon earnings"
          trend="+15% from last month"
          isPositive={true}
        />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Rituals</h2>
            <button className="btn btn-text">View All</button>
          </div>
          <div className="rituals-list">
            <UpcomingRitualsList rituals={data.upcomingRituals || []} />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Pending Approvals</h2>
            <button className="btn btn-text">View All</button>
          </div>
          <div className="approvals-list">
            <PendingApprovalsList approvals={data.pendingRequests || []} />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Earnings Summary (NPR)</h2>
            <div className="timeframe-selector">
              <button className="btn btn-small active">6M</button>
              <button className="btn btn-small">1Y</button>
              <button className="btn btn-small">All</button>
            </div>
          </div>
          <div className="earnings-chart-container">
            <EarningsSummaryChart data={data.monthlyEarnings || []} currency="NPR" />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Reviews</h2>
            <button className="btn btn-text">View All</button>
          </div>
          <div className="reviews-list">
            {(data.recentReviews || []).map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="client-info">
                    <h4>{review.client}</h4>
                    <p>{review.ritual}</p>
                  </div>
                  <div className="rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverview;