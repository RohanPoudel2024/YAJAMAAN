import React from 'react';

const MetricCard = ({ title, value, iconClass, trend, isPositive, isAlert }) => {
  const getTrendClass = () => {
    if (isAlert) return "metric-trend alert";
    return isPositive ? "metric-trend positive" : "metric-trend negative";
  };

  return (
    <div className="metric-card">
      <div className={iconClass}>
        {/* Icon is applied through CSS */}
      </div>
      <div className="metric-details">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value}</p>
        <div className={getTrendClass()}>
          {trend}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;