import React from 'react';
import EarningsSummaryChart from './EarningsSummaryChart';

const EarningsSection = ({ data = {} }) => {
  
  const defaultData = {
    totalEarnings: 0,
    pendingPayments: 0,
    monthlyEarnings: [],
    paymentHistory: []
  };

  
  const earningsData = { ...defaultData, ...data };

  return (
    <div className="dashboard-section earnings-section">
      <header className="dashboard-header">
        <h1>Earnings & Payments</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <span className="icon download"></span> Download Report
          </button>
        </div>
      </header>
      <div className="earnings-overview">
        <div className="metric-card">
          <h3>Total Earnings</h3>
          <p className="metric-value">NPR {earningsData.totalEarnings}</p>
          <p className="metric-trend positive">+15% from last month</p>
        </div>
        <div className="metric-card">
          <h3>Pending Payments</h3>
          <p className="metric-value">NPR {earningsData.pendingPayments}</p>
        </div>
      </div>
      <div className="earnings-chart-container">
        <div className="section-header">
          <h2>Earnings Summary (NPR)</h2>
          <div className="timeframe-selector">
            <button className="btn btn-small active">6M</button>
            <button className="btn btn-small">1Y</button>
            <button className="btn btn-small">All</button>
          </div>
        </div>
        <EarningsSummaryChart data={earningsData.monthlyEarnings} currency="NPR" />
      </div>
      <div className="payment-history">
        <h2>Payment History</h2>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ritual</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {earningsData.paymentHistory && earningsData.paymentHistory.length > 0 ? (
              earningsData.paymentHistory.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.date}</td>
                  <td>{payment.ritual}</td>
                  <td>{payment.client}</td>
                  <td>NPR {payment.amount}</td>
                  <td><span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No payment history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsSection;