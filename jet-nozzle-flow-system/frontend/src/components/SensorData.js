import React from 'react';

const sensorConfig = [
  {
    key: 'pressure',
    label: 'Pressure',
    unit: 'PSI',
    color: 'cyan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    threshold: { warning: 60, format: v => parseFloat(v) },
    trend: '+2.3',
    trendDir: 'up',
  },
  {
    key: 'flowRate',
    label: 'Flow Rate',
    unit: 'GPM',
    color: 'emerald',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    threshold: { warning: 200, format: v => parseFloat(v) },
    trend: '+5.1',
    trendDir: 'up',
  },
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    color: 'amber',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
    threshold: { warning: 85, format: v => parseFloat(v) },
    trend: '-1.2',
    trendDir: 'down',
  },
  {
    key: 'velocity',
    label: 'Velocity',
    unit: 'm/s',
    color: 'purple',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    threshold: { warning: 400, format: v => parseFloat(v) },
    trend: '+12.4',
    trendDir: 'up',
  },
];

const SensorData = ({ data }) => {
  if (!data) {
    return (
      <div className="sensor-section">
        <div className="section-title">Live Sensor Readings</div>
        <div className="empty-state">
          <div className="empty-state-icon">📡</div>
          <p>Waiting for sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sensor-section" id="sensor-readings">
      <div className="section-title">Live Sensor Readings</div>
      <div className="sensor-grid">
        {sensorConfig.map((sensor) => {
          const value = data[sensor.key] || 0;
          const numValue = sensor.threshold.format(value);
          const status = numValue >= sensor.threshold.warning ? 'warning' : 'normal';

          return (
            <div key={sensor.key} className={`sensor-card ${sensor.color}`} id={`sensor-${sensor.key}`}>
              <div className="sensor-card-header">
                <div className={`sensor-icon ${sensor.color}`}>
                  {sensor.icon}
                </div>
                <div className="sensor-live-dot"></div>
              </div>
              <div className="sensor-label">{sensor.label}</div>
              <div className="sensor-value">
                {value}
                <span className="unit">{sensor.unit}</span>
              </div>
              <div className="sensor-footer">
                <span className={sensor.trendDir === 'up' ? 'trend-up' : 'trend-down'}>
                  {sensor.trendDir === 'up' ? '▲' : '▼'} {sensor.trend}%
                </span>
                <span className={`sensor-status ${status}`}>{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorData;
