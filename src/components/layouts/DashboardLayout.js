import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderNav from '../layout/HeaderNav.jsx';
import SidebarNav from '../layout/SidebarNav.jsx';

const DashboardLayout = () => {
  const { currentUser, userProfile, isLandlord, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Wait for auth to be initialized before making decisions
  useEffect(() => {
    if (!authLoading) {
      setIsReady(true);
    }
  }, [authLoading]);

  // Add more debugging info
  useEffect(() => {
    if (isReady) {
      console.log('DashboardLayout - Auth Status:', {
        isReady,
        pathname: location.pathname,
        currentUser: currentUser?.uid,
        userProfile,
        hasCompletedOnboarding: userProfile?.onboardingComplete
      });
    }
  }, [isReady, location.pathname, currentUser, userProfile]);
  
  // If still loading, show loading state
  if (!isReady || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        <p className="ml-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    console.log('DashboardLayout - No current user, redirecting to login');
    return <Navigate to="/login" />;
  }

  // If no profile loaded yet, show loading
  if (!userProfile) {
    console.log('DashboardLayout - User authenticated but no profile, showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        <p className="ml-2 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Handle onboarding redirect based on user type and completion status
  if (userProfile && userProfile.onboardingComplete === false) {
    console.log('DashboardLayout - Onboarding not complete, redirecting to onboarding');
    if (isLandlord()) {
      // If landlord hasn't completed onboarding, redirect to landlord-specific flow
      return <Navigate to="/landlord-onboarding" />;
    } else if (userProfile.userType === 'contractor') {
      // If contractor hasn't completed onboarding, redirect to contractor-specific flow
      return <Navigate to="/contractor-onboarding" />;
    } else {
      // For other roles (tenant), redirect to the general onboarding survey
      return <Navigate to="/onboarding" />;
    }
  }

  console.log('DashboardLayout - All checks passed, rendering dashboard content');
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Use SidebarNav component which has the green styling */}
      <SidebarNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Use HeaderNav component */}
        <HeaderNav />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 