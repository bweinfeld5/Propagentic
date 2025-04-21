import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemoMode } from '../context/DemoModeContext';
import dataService from '../services/dataService';

/**
 * DataServiceProvider - Automatically configures the dataService
 * with the current user and demo mode status
 * 
 * This component doesn't render anything, it just sets up the dataService
 */
const DataServiceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { isDemoMode } = useDemoMode();
  
  // Configure dataService whenever auth or demo mode changes
  useEffect(() => {
    dataService.configure({
      isDemoMode,
      currentUser
    });
    
    console.log(`DataServiceProvider: Configured dataService with userID=${currentUser?.uid}, demoMode=${isDemoMode}`);
  }, [currentUser, isDemoMode]);
  
  // This component doesn't render anything additional
  return <>{children}</>;
};

export default DataServiceProvider; 