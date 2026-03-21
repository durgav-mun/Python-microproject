import React, { useState, useEffect } from 'react';
import SensorData from './SensorData';
import Graphs from './Graphs';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Real-Time Flow Monitoring</h2>
      <SensorData data={data?.sensors} />
      <Graphs data={data?.history} />
    </div>
  );
};

export default Dashboard;
