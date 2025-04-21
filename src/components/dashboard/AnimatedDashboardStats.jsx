import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from './DashboardCard';
import StatsChart from './StatsChart';

/**
 * AnimatedDashboardStats Component
 * 
 * A component that displays statistics with animated numbers and optional charts.
 * Useful for key performance indicators (KPIs) in dashboard interfaces.
 */
const AnimatedDashboardStats = ({
  title,
  value,
  previousValue,
  icon,
  description,
  percentageChange,
  changeDirection,
  chartData,
  chartType = 'line',
  chartHeight = 120,
  className = '',
  isLoading = false,
  theme = 'primary',
  to,
  onClick,
  animate = true
}) => {
  // State for the animated counter
  const [displayValue, setDisplayValue] = useState(0);
  
  // Auto-calculate change direction if not provided
  const actualChangeDirection = changeDirection || 
    (percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral');
  
  // Determine the absolute percentage change for display
  const absPercentageChange = Math.abs(percentageChange || 0);
  
  // Color classes based on direction
  const directionColorClass = {
    up: 'text-propagentic-success',
    down: 'text-propagentic-error',
    neutral: 'text-slate-500 dark:text-slate-400'
  };
  
  // Icon components for each direction
  const DirectionIcon = ({ direction }) => {
    if (direction === 'up') {
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (direction === 'down') {
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };
  
  // Animate the number counting up
  useEffect(() => {
    if (isLoading || !animate) {
      setDisplayValue(value);
      return;
    }
    
    let startValue = previousValue || 0;
    let endValue = value || 0;
    const duration = 1000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(startValue + (endValue - startValue) * progress);
      
      setDisplayValue(currentValue);
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value, previousValue, isLoading, animate]);
  
  // Footer element with percentage change
  const footer = percentageChange !== undefined && (
    <div className="flex items-center">
      <span className={`inline-flex items-center mr-1.5 ${directionColorClass[actualChangeDirection]}`}>
        <DirectionIcon direction={actualChangeDirection} />
        <span className="ml-1 font-medium">{absPercentageChange}%</span>
      </span>
      <span className="text-slate-500 dark:text-slate-400">{description}</span>
    </div>
  );
  
  return (
    <DashboardCard
      title={title}
      value={isLoading ? null : displayValue}
      icon={icon}
      footer={footer}
      className={className}
      theme={theme}
      to={to}
      onClick={onClick}
      isLoading={isLoading}
      animate={animate}
    >
      {chartData && (
        <div className="mt-2">
          <StatsChart
            type={chartType}
            data={chartData}
            height={chartHeight}
            showLegend={false}
            animate={animate}
            isLoading={isLoading}
            options={{
              scales: {
                x: {
                  display: false
                },
                y: {
                  display: false
                }
              },
              elements: {
                point: {
                  radius: 0
                },
                line: {
                  borderWidth: 2,
                  tension: 0.4
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  enabled: false
                }
              }
            }}
          />
        </div>
      )}
    </DashboardCard>
  );
};

AnimatedDashboardStats.propTypes = {
  title: PropTypes.node,
  value: PropTypes.number,
  previousValue: PropTypes.number,
  icon: PropTypes.node,
  description: PropTypes.node,
  percentageChange: PropTypes.number,
  changeDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  chartData: PropTypes.object,
  chartType: PropTypes.oneOf(['line', 'bar']),
  chartHeight: PropTypes.number,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  theme: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'neutral']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  animate: PropTypes.bool
};

export default AnimatedDashboardStats; 