import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { UserCircleIcon, WifiIcon, SignalSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import NotificationBell from '../notifications/NotificationBell';
import NotificationPanel from './NotificationPanel';
import NotificationErrorBoundary from '../shared/NotificationErrorBoundary';

// HeaderNav component with sidebar toggle removed
const HeaderNav = () => {
  const { userProfile, logout } = useAuth();
  const { isOnline, isFirestoreAvailable, getOfflineStatus, getOfflineDurationText } = useConnection();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const connectionStatus = getOfflineStatus();

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

  // Offline indicator styles based on connection status
  const getConnectionStatusIndicator = () => {
    if (connectionStatus === 'online') {
      return null; // Don't show indicator when online
    }
    
    if (connectionStatus === 'service-disruption') {
      return (
        <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full mr-2">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Service Disruption</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full mr-2">
        <SignalSlashIcon className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Offline Mode</span>
      </div>
    );
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      {/* Left side: Page title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-800">{getDashboardTitle()}</h1>
      </div>

      {/* Right side: Connection status, Notifications and Profile Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Connection status indicator */}
        {getConnectionStatusIndicator()}

        <NotificationErrorBoundary>
          <NotificationBell onClick={() => setNotificationPanelOpen(true)} />
        </NotificationErrorBoundary>

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

        {/* Notification Panel */}
        <NotificationErrorBoundary>
          <NotificationPanel 
            isOpen={notificationPanelOpen} 
            onClose={() => setNotificationPanelOpen(false)} 
          />
        </NotificationErrorBoundary>
      </div>
    </header>
  );
};

export default HeaderNav; 