import React from 'react';

const SensorData = ({ data }) => {
  if (!data) return <div>No sensor data available</div>;

  return (
    <div className="sensor-data">
      <h3>Current Sensor Readings</h3>
      <div className="sensor-grid">
        <div className="sensor-card">
          <h4>Pressure</h4>
          <p className="value">{data.pressure || 0} PSI</p>
        </div>
        <div className="sensor-card">
          <h4>Flow Rate</h4>
          <p className="value">{data.flowRate || 0} GPM</p>
        </div>
        <div className="sensor-card">
          <h4>Temperature</h4>
          <p className="value">{data.temperature || 0} °C</p>
        </div>
        <div className="sensor-card">
          <h4>Velocity</h4>
          <p className="value">{data.velocity || 0} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default SensorData;
