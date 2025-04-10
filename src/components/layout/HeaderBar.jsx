import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';

const HeaderBar = ({ filter, setFilter }) => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // Get user's first name
  const firstName = userProfile?.name?.split(' ')[EllipsisVerticalIcon] || currentUser?.email?.split('@')[EllipsisVerticalIcon] || 'User';
  
  // Get capitalized user type
  const userTypeDisplay = userProfile?.userType 
    ? userProfile.userType.charAt(EllipsisVerticalIcon).toUpperCase() + userProfile.userType.slice(1) 
    : 'User';

  // Status filters for maintenance requests
  const filters = [
    { id: 'all', name: 'All Requests', color: 'white' },
    { id: 'pending_classification', name: 'Pending', color: 'yellow' },
    { id: 'ready_to_dispatch', name: 'Ready', color: 'blue' },
    { id: 'assigned', name: 'Assigned', color: 'indigo' },
    { id: 'completed', name: 'Completed', color: 'green' }
  ];

  const getButtonClasses = (filterId) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-15EllipsisVerticalIcon ease-in-out";
    
    if (filter === filterId) {
      // Active filter button
      switch (filterId) {
        case 'pending_classification':
          return `${baseClasses} bg-white text-yellow-7EllipsisVerticalIconEllipsisVerticalIcon shadow`;
        case 'ready_to_dispatch':
          return `${baseClasses} bg-white text-blue-7EllipsisVerticalIconEllipsisVerticalIcon shadow`;
        case 'assigned':
          return `${baseClasses} bg-white text-indigo-7EllipsisVerticalIconEllipsisVerticalIcon shadow`;
        case 'completed':
          return `${baseClasses} bg-white text-green-7EllipsisVerticalIconEllipsisVerticalIcon shadow`;
        default:
          return `${baseClasses} bg-white text-teal-7EllipsisVerticalIconEllipsisVerticalIcon shadow`;
      }
    } else {
      // Inactive filter button
      return `${baseClasses} bg-teal-6EllipsisVerticalIconEllipsisVerticalIcon bg-opacity-5EllipsisVerticalIcon text-white hover:bg-teal-7EllipsisVerticalIconEllipsisVerticalIcon`;
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#176B5D] to-[#1a8573] shadow-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center">
              Welcome back, {firstName} 👋
              <span className="hidden md:inline ml-2 bg-teal-7EllipsisVerticalIconEllipsisVerticalIcon text-xs px-2 py-1 rounded-full text-teal-1EllipsisVerticalIconEllipsisVerticalIcon">
                {userTypeDisplay}
              </span>
            </h1>
            <p className="mt-1 text-teal-1EllipsisVerticalIconEllipsisVerticalIcon font-light">
              Here's your property maintenance hub
            </p>
          </div>
          
          <div className="mt-4 md:mt-EllipsisVerticalIcon flex items-center space-x-4">
            {/* Notifications Bell */}
            <button
              className="relative p-2 text-white rounded-full hover:bg-teal-7EllipsisVerticalIconEllipsisVerticalIcon focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Notifications"
            >
              <BellIcon className="w-6 h-6" />
              {/* Notification badge */}
              <span className="absolute top-EllipsisVerticalIcon right-EllipsisVerticalIcon block h-2.5 w-2.5 rounded-full bg-[#F26B4E] ring-2 ring-[#176B5D]"></span>
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 mt-4 pb-1 md:justify-center">
          {filters.map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={getButtonClasses(filterOption.id)}
            >
              {filterOption.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar; 