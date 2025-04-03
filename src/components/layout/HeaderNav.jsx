import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BellIcon, UserCircleIcon } from '@heroicons/react/outline';

// HeaderNav component with sidebar toggle removed
const HeaderNav = () => {
  const { userProfile, logout } = useAuth();

  // Get dashboard title based on user type
  const getDashboardTitle = () => {
    if (!userProfile) return 'Dashboard';
    
    switch (userProfile.userType) {
      case 'landlord':
        return 'Landlord Dashboard';
      case 'tenant':
        return 'Tenant Dashboard';
      case 'contractor':
        return 'Contractor Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login handled by DashboardLayout or App Router
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      {/* Left side: Page title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-800">{getDashboardTitle()}</h1>
      </div>

      {/* Right side: Notifications and Profile Dropdown */}
      <div className="flex items-center space-x-4">
        <button className="relative text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {/* Add notification badge here if needed */}
          {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400" /> */}
        </button>

        {/* Profile Dropdown Placeholder */}
        <div className="relative">
          <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            <span className="sr-only">Open user menu</span>
            {/* Add user avatar image if available, otherwise icon */}
            <UserCircleIcon className="h-8 w-8 text-slate-500" />
            <span className="ml-2 hidden md:inline text-sm font-medium text-slate-700">
              {userProfile?.firstName || userProfile?.email}
            </span>
             {/* Dropdown arrow */}
             <svg className="ml-1 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav; 