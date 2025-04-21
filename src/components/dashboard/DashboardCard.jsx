import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * DashboardCard Component
 * 
 * A reusable card component for dashboard interfaces with support for hover effects,
 * animations, and different color themes.
 */
const DashboardCard = ({
  title,
  value,
  icon,
  footer,
  className = '',
  theme = 'primary',
  to,
  onClick,
  isLoading = false,
  animate = true,
  delay = 0,
  growOnHover = true,
  children
}) => {
  // Define theme color classes
  const themeClasses = {
    primary: 'border-propagentic-teal/20 bg-gradient-to-br from-propagentic-teal/5 to-propagentic-teal/10 dark:from-propagentic-teal/10 dark:to-propagentic-teal/20',
    secondary: 'border-propagentic-blue/20 bg-gradient-to-br from-propagentic-blue/5 to-propagentic-blue/10 dark:from-propagentic-blue/10 dark:to-propagentic-blue/20',
    success: 'border-propagentic-success/20 bg-gradient-to-br from-propagentic-success/5 to-propagentic-success/10 dark:from-propagentic-success/10 dark:to-propagentic-success/20',
    warning: 'border-propagentic-yellow/20 bg-gradient-to-br from-propagentic-yellow/5 to-propagentic-yellow/10 dark:from-propagentic-yellow/10 dark:to-propagentic-yellow/20',
    error: 'border-propagentic-error/20 bg-gradient-to-br from-propagentic-error/5 to-propagentic-error/10 dark:from-propagentic-error/10 dark:to-propagentic-error/20',
    neutral: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-propagentic-slate-dark'
  };
  
  // Icon color classes
  const iconColorClasses = {
    primary: 'text-propagentic-teal',
    secondary: 'text-propagentic-blue',
    success: 'text-propagentic-success',
    warning: 'text-propagentic-yellow',
    error: 'text-propagentic-error',
    neutral: 'text-propagentic-slate-dark dark:text-white'
  };
  
  // Create the base component, either a button, link, or div
  const CardComponent = ({ children, ...props }) => {
    if (to) {
      return <Link to={to} {...props}>{children}</Link>;
    }
    if (onClick) {
      return <button type="button" onClick={onClick} {...props}>{children}</button>;
    }
    return <div {...props}>{children}</div>;
  };
  
  // Content for the card
  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-4">
        {title && <h3 className="text-base font-medium text-slate-700 dark:text-slate-200">{title}</h3>}
        {icon && <span className={`${iconColorClasses[theme]}`}>{icon}</span>}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3 mb-4"></div>
      ) : (
        value && <div className="text-2xl font-bold text-propagentic-slate-dark dark:text-white mb-2">{value}</div>
      )}
      
      {children}
      
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </>
  );
  
  // Apply all appropriate classes
  const combinedClassName = `
    relative rounded-xl border p-5 shadow-sm 
    ${themeClasses[theme]} 
    ${to || onClick ? 'cursor-pointer' : ''} 
    ${growOnHover && (to || onClick) ? 'transition-all duration-200 hover:shadow-md' : ''}
    ${className}
  `.trim();
  
  // Return animated or non-animated version
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={growOnHover && (to || onClick) ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
        className={combinedClassName}
      >
        <CardComponent className="block h-full w-full">
          {cardContent}
        </CardComponent>
      </motion.div>
    );
  }
  
  return (
    <div className={combinedClassName}>
      <CardComponent className="block h-full w-full">
        {cardContent}
      </CardComponent>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  icon: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'neutral']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  animate: PropTypes.bool,
  delay: PropTypes.number,
  growOnHover: PropTypes.bool,
  children: PropTypes.node
};

export default DashboardCard; 