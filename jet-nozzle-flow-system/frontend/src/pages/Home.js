import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '📊',
      color: 'cyan',
      title: 'Real-Time Monitoring',
      description: 'Live sensor data display for pressure, temperature, flow rate, and velocity with instant updates.',
    },
    {
      icon: '🔬',
      color: 'emerald',
      title: 'Flow Analysis',
      description: 'Historical data analysis with trend detection, anomaly alerts, and statistical breakdowns.',
    },
    {
      icon: '⚙️',
      color: 'amber',
      title: 'Nozzle Optimization',
      description: 'Interactive design tools with live SVG preview, material selection, and performance metrics.',
    },
    {
      icon: '📈',
      color: 'purple',
      title: 'Data Visualization',
      description: 'Beautiful Chart.js powered graphs with gradient fills, tooltips, and real-time updates.',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'System Uptime' },
    { value: '1.2M', label: 'Data Points' },
    { value: '24', label: 'Active Nozzles' },
    { value: '< 50ms', label: 'Response Time' },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            System Operational
          </div>
          <h1>
            Jet Nozzle<br />
            <span className="gradient-text">Flow System</span>
          </h1>
          <p>
            Monitor, analyze, and optimize jet nozzle flow dynamics in real-time.
            Advanced sensor integration with powerful visualization tools for
            precision engineering.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary" id="cta-dashboard">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Open Dashboard
            </Link>
            <Link to="/analysis" className="btn btn-secondary" id="cta-analysis">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              View Analysis
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features-section">
        <div className="section-title">Core Capabilities</div>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className={`feature-icon ${feature.color}`}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" id="stats-section">
        <div className="section-title">System Performance</div>
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
