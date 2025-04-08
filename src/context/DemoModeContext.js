import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const DemoModeContext = createContext();

// Demo mode provider component
export const DemoModeProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState(null);

  // Check for demo mode on load
  useEffect(() => {
    const demoMode = process.env.REACT_APP_DEMO_MODE === 'true';
    setIsDemoMode(demoMode);
    
    if (demoMode) {
      // Show initial toast notification
      toast.success(
        'Demo mode active - data changes will not be saved', 
        { 
          icon: '🧪',
          duration: 5000,
          id: 'demo-mode-toast'
        }
      );
      
      // Load demo user information if available in localStorage
      const savedDemoUser = localStorage.getItem('propagentic_demo_user');
      if (savedDemoUser) {
        try {
          setDemoUser(JSON.parse(savedDemoUser));
        } catch (e) {
          console.error('Error parsing demo user from localStorage', e);
        }
      }
    }
  }, []);

  // Function to switch between demo roles
  const switchDemoRole = (role) => {
    if (!isDemoMode) return;
    
    let newDemoUser;
    
    switch(role) {
      case 'landlord':
        newDemoUser = {
          uid: 'demo-landlord-123',
          email: 'demo-landlord@propagentic.com',
          displayName: 'Demo Landlord',
          userType: 'landlord',
          photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        break;
      case 'contractor':
        newDemoUser = {
          uid: 'demo-contractor-123',
          email: 'demo-contractor@propagentic.com',
          displayName: 'Demo Contractor',
          userType: 'contractor',
          photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
          specialties: ['plumbing', 'electrical', 'general_maintenance']
        };
        break;
      case 'tenant':
        newDemoUser = {
          uid: 'demo-tenant-123',
          email: 'demo-tenant@propagentic.com',
          displayName: 'Demo Tenant',
          userType: 'tenant',
          photoURL: 'https://randomuser.me/api/portraits/men/76.jpg',
          propertyId: 'demo-property-123'
        };
        break;
      default:
        return;
    }
    
    setDemoUser(newDemoUser);
    localStorage.setItem('propagentic_demo_user', JSON.stringify(newDemoUser));
    
    // Show notification about role switch
    toast.success(
      `Switched to ${role} demo view`,
      { 
        icon: '👤',
        duration: 3000
      }
    );
  };

  // Function to show a write operation notification
  const notifyWriteBlocked = () => {
    if (isDemoMode) {
      toast.error(
        'Write operations are disabled in demo mode',
        {
          icon: '🔒',
          duration: 3000
        }
      );
      return true; // Operation was blocked
    }
    return false; // Operation was not blocked
  };

  // Provide context values
  const value = {
    isDemoMode,
    demoUser,
    switchDemoRole,
    notifyWriteBlocked
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

// Custom hook for using demo mode context
export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export default DemoModeContext; 