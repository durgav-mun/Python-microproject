import React, { useEffect, useRef, useMemo } from 'react';
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Generate demo data for charts
const generateDemoData = () => {
  const labels = [];
  const flowData = [];
  const pressureData = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    flowData.push(120 + Math.sin(i / 3) * 20 + Math.random() * 10);
    pressureData.push(40 + Math.cos(i / 4) * 8 + Math.random() * 5);
  }

  return { labels, flowData, pressureData };
};

const Graphs = ({ data }) => {
  const lineRef = useRef(null);
  const barRef = useRef(null);
  const demoData = useMemo(() => generateDemoData(), []);

  const chartTextColor = '#8892a4';
  const gridColor = 'rgba(255, 255, 255, 0.04)';

  useEffect(() => {
    return () => {
      if (lineRef.current) lineRef.current.destroy?.();
      if (barRef.current) barRef.current.destroy?.();
    };
  }, []);

  const flowChartData = {
    labels: demoData.labels,
    datasets: [
      {
        label: 'Flow Rate (GPM)',
        data: demoData.flowData,
        borderColor: '#22d3ee',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(34, 211, 238, 0.1)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.2)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#22d3ee',
        pointHoverBorderColor: '#0a0e1a',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const pressureChartData = {
    labels: demoData.labels,
    datasets: [
      {
        label: 'Pressure (PSI)',
        data: demoData.pressureData,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(99, 102, 241, 0.6)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.7)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)');
          return gradient;
        },
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
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
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor,
          font: { family: 'Inter', size: 10 },
          maxRotation: 0,
          maxTicksLimit: 8,
        },
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        border: { display: false },
      },
      y: {
        ticks: {
          color: chartTextColor,
          font: { family: 'JetBrains Mono', size: 10 },
          padding: 8,
        },
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="charts-section" id="charts-section">
      <div className="section-title">Historical Data Visualization</div>
      <div className="charts-grid">
        <div className="chart-card" id="flow-rate-chart">
          <div className="chart-header">
            <span className="chart-title">Flow Rate Over Time</span>
            <span className="chart-badge">Live 24h</span>
          </div>
          <div className="chart-container">
            <Line ref={lineRef} data={flowChartData} options={commonOptions} />
          </div>
        </div>
        <div className="chart-card" id="pressure-chart">
          <div className="chart-header">
            <span className="chart-title">Pressure Distribution</span>
            <span className="chart-badge">Live 24h</span>
          </div>
          <div className="chart-container">
            <Bar ref={barRef} data={pressureChartData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
