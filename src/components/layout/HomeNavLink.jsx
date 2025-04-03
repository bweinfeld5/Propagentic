import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HomeIcon } from '@heroicons/react/outline';

const HomeNavLink = ({ className, showOnAuth = false }) => {
  const { currentUser } = useAuth();
  
  // Don't show on authenticated pages unless specifically requested
  if (currentUser && !showOnAuth) return null;
  
  return (
    <Link 
      to="/" 
      className={`inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 ${className || ''}`}
    >
      <HomeIcon className="mr-1 h-5 w-5" />
      Back to Home
    </Link>
  );
};

export default HomeNavLink; 