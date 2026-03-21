import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

const timeRanges = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

const generateAnalysisData = (range) => {
  const pointCount = range === '1h' ? 12 : range === '6h' ? 36 : range === '24h' ? 48 : range === '7d' ? 84 : 120;
  const labels = [];
  const flowData = [];
  const tempData = [];
  const pressureData = [];

  for (let i = 0; i < pointCount; i++) {
    labels.push(`T${i}`);
    flowData.push(125 + Math.sin(i / 5) * 25 + Math.random() * 15);
    tempData.push(65 + Math.cos(i / 7) * 10 + Math.random() * 5);
    pressureData.push(42 + Math.sin(i / 4) * 6 + Math.random() * 4);
  }

  const avgFlow = (flowData.reduce((a, b) => a + b, 0) / flowData.length).toFixed(1);
  const maxPressure = Math.max(...pressureData).toFixed(1);
  const avgTemp = (tempData.reduce((a, b) => a + b, 0) / tempData.length).toFixed(1);

  return {
    labels, flowData, tempData, pressureData,
    stats: {
      avgFlow, maxPressure, avgTemp,
      dataPoints: pointCount * 4,
    },
  };
};

const Analysis = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const analysisData = useMemo(() => generateAnalysisData(timeRange), [timeRange]);

  const chartTextColor = '#8892a4';
  const gridColor = 'rgba(255, 255, 255, 0.04)';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 22, 41, 0.95)',
        titleColor: '#f0f2f5',
        bodyColor: '#8892a4',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { family: 'Inter', weight: '600', size: 13 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      },
    },
    scales: {
      x: {
        ticks: { color: chartTextColor, font: { size: 10 }, maxTicksLimit: 10, maxRotation: 0 },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: { color: chartTextColor, font: { family: 'JetBrains Mono', size: 10 }, padding: 8 },
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
      },
    },
  };

  const trendData = {
    labels: analysisData.labels,
    datasets: [
      {
        label: 'Flow Rate (GPM)',
        data: analysisData.flowData,
        borderColor: '#22d3ee',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'rgba(34, 211, 238, 0.1)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(34, 211, 238, 0.15)');
          g.addColorStop(1, 'rgba(34, 211, 238, 0.0)');
          return g;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Temperature (°C)',
        data: analysisData.tempData,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const distributionData = {
    labels: analysisData.labels.filter((_, i) => i % 4 === 0),
    datasets: [
      {
        label: 'Pressure (PSI)',
        data: analysisData.pressureData.filter((_, i) => i % 4 === 0),
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'rgba(168, 85, 247, 0.6)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(168, 85, 247, 0.7)');
          g.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
          return g;
        },
        borderRadius: 4,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  };

  const anomalies = [
    {
      title: 'Pressure Spike Detected',
      description: `Unusual pressure increase of ${analysisData.stats.maxPressure} PSI detected during the selected period. Consider reviewing nozzle configuration.`,
      severity: 'warning',
    },
    {
      title: 'Temperature Variance',
      description: 'Temperature fluctuations exceed normal operating range by 3.2°C. Cooling system check recommended.',
      severity: 'info',
    },
  ];

  return (
    <div className="analysis-page" id="analysis-page">
      <div className="page-header">
        <h1>Flow Analysis</h1>
        <p>Historical data analysis with trend detection and anomaly alerts</p>
      </div>

      {/* Time Range Controls */}
      <div className="analysis-controls" id="time-controls">
        {timeRanges.map((tr) => (
          <button
            key={tr.value}
            className={`time-pill ${timeRange === tr.value ? 'active' : ''}`}
            onClick={() => setTimeRange(tr.value)}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="analysis-stats">
        <div className="analysis-stat-card">
          <div className="analysis-stat-label">Avg Flow Rate</div>
          <div className="analysis-stat-value">
            {analysisData.stats.avgFlow}<span className="unit"> GPM</span>
          </div>
        </div>
        <div className="analysis-stat-card">
          <div className="analysis-stat-label">Max Pressure</div>
          <div className="analysis-stat-value">
            {analysisData.stats.maxPressure}<span className="unit"> PSI</span>
          </div>
        </div>
        <div className="analysis-stat-card">
          <div className="analysis-stat-label">Avg Temperature</div>
          <div className="analysis-stat-value">
            {analysisData.stats.avgTemp}<span className="unit"> °C</span>
          </div>
        </div>
        <div className="analysis-stat-card">
          <div className="analysis-stat-label">Data Points</div>
          <div className="analysis-stat-value">
            {analysisData.stats.dataPoints.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="analysis-charts">
        <div className="analysis-chart-card" id="trend-chart">
          <div className="chart-header">
            <span className="chart-title">Flow & Temperature Trends</span>
            <span className="chart-badge">{timeRange}</span>
          </div>
          <div className="chart-container">
            <Line data={trendData} options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  display: true,
                  position: 'top',
                  align: 'end',
                  labels: {
                    color: chartTextColor,
                    font: { family: 'Inter', size: 11 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 16,
                  },
                },
              },
            }} />
          </div>
        </div>
        <div className="analysis-chart-card" id="distribution-chart">
          <div className="chart-header">
            <span className="chart-title">Pressure Distribution</span>
            <span className="chart-badge">{timeRange}</span>
          </div>
          <div className="chart-container">
            <Bar data={distributionData} options={commonOptions} />
          </div>
        </div>
      </div>

      {/* Anomaly Alerts */}
      <div className="anomaly-section" id="anomaly-section">
        <div className="section-title">Anomaly Detection</div>
        {anomalies.map((anomaly, i) => (
          <div key={i} className="anomaly-card">
            <div className="anomaly-icon">
              {anomaly.severity === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="anomaly-content">
              <h4>{anomaly.title}</h4>
              <p>{anomaly.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
