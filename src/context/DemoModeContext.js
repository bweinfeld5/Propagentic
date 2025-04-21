import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useConnection } from './ConnectionContext';
import * as demoData from '../utils/demoData';

// Create context
export const DemoModeContext = createContext({
  isDemoMode: false,
  enableDemoMode: () => {},
  disableDemoMode: () => {},
  toggleDemoMode: () => {},
  isAutoFallbackEnabled: false,
  toggleAutoFallback: () => {}
});

// Custom hook for using the context
export const useDemoMode = () => useContext(DemoModeContext);

// Provider component
export const DemoModeProvider = ({ children }) => {
  // State to track if demo mode is active
  const [isDemoMode, setIsDemoMode] = useState(false);
  // State to track if auto fallback to demo mode is enabled
  const [isAutoFallbackEnabled, setIsAutoFallbackEnabled] = useState(true);
  // Track the reason for entering demo mode
  const [demoModeReason, setDemoModeReason] = useState('');
  
  // Get connection status from ConnectionContext
  const { isOnline, isFirestoreAvailable, getOfflineStatus } = useConnection();
  
  // Enable demo mode with a reason
  const enableDemoMode = (reason = 'user_enabled') => {
    setIsDemoMode(true);
    setDemoModeReason(reason);
    // Save to localStorage for persistence
    localStorage.setItem('demoModeActive', 'true');
    localStorage.setItem('demoModeReason', reason);
    console.log(`Demo mode activated. Reason: ${reason}`);
  };
  
  // Disable demo mode
  const disableDemoMode = () => {
    setIsDemoMode(false);
    setDemoModeReason('');
    // Save to localStorage for persistence
    localStorage.setItem('demoModeActive', 'false');
    localStorage.removeItem('demoModeReason');
    console.log('Demo mode deactivated');
  };
  
  // Toggle demo mode
  const toggleDemoMode = () => {
    if (isDemoMode) {
      disableDemoMode();
    } else {
      enableDemoMode('user_toggled');
    }
  };
  
  // Toggle auto fallback setting
  const toggleAutoFallback = () => {
    const newValue = !isAutoFallbackEnabled;
    setIsAutoFallbackEnabled(newValue);
    localStorage.setItem('autoFallbackEnabled', newValue.toString());
    console.log(`Auto fallback to demo mode ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  // Auto-fallback to demo mode when Firebase is unavailable
  useEffect(() => {
    const handleConnectionStatus = () => {
      const connectionStatus = getOfflineStatus();
      
      if (isAutoFallbackEnabled && !isDemoMode) {
        if (connectionStatus === 'offline') {
          enableDemoMode('offline');
        } else if (connectionStatus === 'service-disruption') {
          enableDemoMode('service_disruption');
        }
      } else if (isDemoMode && demoModeReason !== 'user_toggled' && demoModeReason !== 'user_enabled') {
        // If connection is restored and demo mode was auto-enabled, disable it
        if (connectionStatus === 'online') {
          disableDemoMode();
        }
      }
    };
    
    handleConnectionStatus();
  }, [isOnline, isFirestoreAvailable, isAutoFallbackEnabled, isDemoMode, demoModeReason, getOfflineStatus]);
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const storedDemoMode = localStorage.getItem('demoModeActive') === 'true';
    const storedReason = localStorage.getItem('demoModeReason') || '';
    const storedAutoFallback = localStorage.getItem('autoFallbackEnabled') !== 'false'; // Default to true
    
    setIsDemoMode(storedDemoMode);
    setDemoModeReason(storedReason);
    setIsAutoFallbackEnabled(storedAutoFallback);
  }, []);
  
  // Value to be provided to consumers
  const value = {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    toggleDemoMode,
    demoModeReason,
    isAutoFallbackEnabled,
    toggleAutoFallback,
    // Expose demo data getters for convenience
    getDemoUser: demoData.getDemoUser,
    getDemoUserByEmail: demoData.getDemoUserByEmail,
    getDemoPropertiesForLandlord: demoData.getDemoPropertiesForLandlord,
    getDemoPropertyById: demoData.getDemoPropertyById,
    getDemoTicketsForProperty: demoData.getDemoTicketsForProperty,
    getDemoTicketsForTenant: demoData.getDemoTicketsForTenant,
    getDemoTicketsForContractor: demoData.getDemoTicketsForContractor,
    getDemoTenantsForProperty: demoData.getDemoTenantsForProperty,
    getDemoNotificationsForUser: demoData.getDemoNotificationsForUser
  };
  
  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export default DemoModeProvider; 