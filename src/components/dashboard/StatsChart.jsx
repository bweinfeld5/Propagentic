import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
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

/**
 * StatsChart Component
 * 
 * A reusable component for rendering line or bar charts with animations
 * for dashboard statistics and metrics visualization.
 */
const StatsChart = ({
  type = 'line',
  data,
  height = 200,
  showLegend = true,
  animate = true,
  title,
  className = '',
  options = {},
  isLoading = false
}) => {
  const [chartData, setChartData] = useState(null);
  
  // Initialize the chart when data changes
  useEffect(() => {
    if (!data || isLoading) return;
    
    setChartData(data);
  }, [data, isLoading]);
  
  // Default options with theming
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          },
          color: 'rgb(107, 114, 128)' // text-gray-500
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 14,
          weight: 'normal'
        },
        color: 'rgb(75, 85, 99)' // text-gray-600
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'rgb(17, 24, 39)', // text-gray-900
        bodyColor: 'rgb(55, 65, 81)', // text-gray-700
        borderColor: 'rgb(229, 231, 235)', // border-gray-200
        borderWidth: 1,
        padding: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          // Optional custom callbacks for tooltips
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'rgba(229, 231, 235, 0.5)' // border-gray-200 with opacity
        },
        ticks: {
          color: 'rgb(107, 114, 128)', // text-gray-500
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'rgba(229, 231, 235, 0.5)' // border-gray-200 with opacity
        },
        ticks: {
          color: 'rgb(107, 114, 128)', // text-gray-500
          font: {
            size: 11
          }
        }
      }
    }
  };
  
  // Merge custom options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Rendering based on loading state
  if (isLoading) {
    return (
      <div className={`w-full h-${height / 4} ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 rounded-lg animate-pulse">
          <svg className="w-10 h-10 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  // Return empty state if no data
  if (!chartData) {
    return (
      <div className={`w-full h-${height / 4} ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 rounded-lg">
          <p className="text-slate-400 dark:text-slate-600 text-sm">No data available</p>
        </div>
      </div>
    );
  }
  
  // Render the chart with animation wrapper if animate is true
  const chart = type === 'line' ? (
    <Line data={chartData} options={mergedOptions} height={height} />
  ) : (
    <Bar data={chartData} options={mergedOptions} height={height} />
  );
  
  if (animate) {
    return (
      <motion.div
        className={`w-full ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {chart}
      </motion.div>
    );
  }
  
  return <div className={`w-full ${className}`}>{chart}</div>;
};

StatsChart.propTypes = {
  /** Chart type - 'line' or 'bar' */
  type: PropTypes.oneOf(['line', 'bar']),
  /** Chart data conforming to Chart.js format */
  data: PropTypes.object,
  /** Height of the chart in pixels */
  height: PropTypes.number,
  /** Whether to show the legend */
  showLegend: PropTypes.bool,
  /** Whether to animate the chart appearance */
  animate: PropTypes.bool,
  /** Chart title */
  title: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Chart.js options override */
  options: PropTypes.object,
  /** Loading state */
  isLoading: PropTypes.bool
};

export default StatsChart; 