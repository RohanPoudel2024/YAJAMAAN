import React from 'react';
import '../../styles/earnings-chart.css';

const EarningsSummaryChart = ({ data, currency = 'NPR' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No earnings data available</p>
      </div>
    );
  }

  
  const maxAmount = Math.max(...data.map(item => item.earnings || item.amount));
  
  
  const totalAmount = data.reduce((sum, item) => sum + (item.earnings || item.amount), 0);
  const averageAmount = Math.round(totalAmount / data.length);
  
  return (
    <div className="earnings-chart">
      <div className="chart-bars">
        {data.map((item, index) => {
          const amount = item.earnings || item.amount;
          const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          
          return (
            <div className="bar-container" key={index}>
              <div 
                className="bar" 
                style={{ height: `${height}%` }}
                title={`${item.month}: ${currency} ${amount}`}
              />
              <span className="bar-label">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="earnings-summary">
        <div className="summary-item">
          <span className="summary-label">Average Monthly</span>
          <span className="summary-value">{currency} {averageAmount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Highest Month</span>
          <span className="summary-value">{currency} {maxAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummaryChart;