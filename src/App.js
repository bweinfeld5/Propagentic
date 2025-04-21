import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/shared/NotificationProvider';
import ConnectionProvider from './context/ConnectionContext';
import DemoModeProvider from './context/DemoModeContext';
import DataServiceProvider from './providers/DataServiceProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';

// Pages & Components
import LandingPage from './components/landing/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// New Components
import TenantDashboard from './pages/tenant/TenantDashboard';
import LandlordTicketDashboard from './components/landlord/LandlordTicketDashboard';
import ContractorDashboard from './components/contractor/ContractorDashboard';
import CreateLandlordProfile from './components/landlord/CreateLandlordProfile';

// Existing Pages
import MaintenanceFormPage from './pages/MaintenanceFormPage';
import MyMaintenanceRequestsPage from './pages/MyMaintenanceRequestsPage';
import PricingPage from './pages/PricingPage';
import OnboardingSurvey from './components/onboarding/OnboardingSurvey';
import LandlordOnboarding from './components/onboarding/LandlordOnboarding';
import ContractorOnboardingPage from './pages/ContractorOnboardingPage';
import JobDetailPage from './pages/JobDetailPage';
import JobHistoryPage from './pages/JobHistoryPage';
import ContractorProfilePage from './pages/ContractorProfilePage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthPage from './pages/AuthPage';
import EnhancedLandingPage from './components/landing/EnhancedLandingPage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';

// AI Example Pages
import AIExamples from './pages/AIExamples';
import AITutorial from './pages/AITutorial';

// Showcase Page for UI Components
import ComponentsShowcasePage from './pages/ComponentsShowcasePage';
import TestUIComponents from './pages/TestUIComponents';
import SimpleUIShowcase from './pages/SimpleUIShowcase';

// Auth hook
import { useAuth } from './context/AuthContext'; 

// Route Guards
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
     return <div className="flex h-screen items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
     </div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Role-specific redirect component
const RoleBasedRedirect = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuth(); // Get userProfile and auth loading state
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Wait for auth and profile to be loaded
    if (authLoading || !currentUser) {
      // If auth is still loading or no user, wait or redirect to login
      if (!authLoading && !currentUser) {
        console.log('RoleBasedRedirect: No user, navigating to login.');
        navigate('/login');
      }
      // Keep profileLoading true until auth is ready
      setProfileLoading(authLoading); 
      return; 
    }

    // Auth is loaded, currentUser exists. Now check profile.
    // Use userProfile from context directly, assuming fetch happens on auth change
    if (!userProfile) {
      // Profile might still be loading via onAuthStateChanged
      console.log('RoleBasedRedirect: Waiting for user profile...');
      // We might need a more robust way to wait if fetchUserProfile is slow
      // For now, assume context updates trigger re-render
      setProfileLoading(true); 
      return; 
    }

    // Profile is available
    setProfileLoading(false);
    console.log('RoleBasedRedirect: User profile loaded:', userProfile);

    const userRole = userProfile.userType || userProfile.role;
    const onboardingComplete = userProfile.onboardingComplete;

    console.log(`RoleBasedRedirect - Role: ${userRole}, Onboarding Complete: ${onboardingComplete}`);

    if (!onboardingComplete) {
      console.log('RoleBasedRedirect: Onboarding not complete, redirecting...');
      switch (userRole) {
        case 'landlord':
          navigate('/landlord-onboarding');
          break;
        case 'contractor':
          navigate('/contractor-onboarding');
          break;
        case 'tenant': // Assuming tenants might have a simple onboarding survey
        default:
          // Redirect to generic onboarding or profile if no specific role onboarding
          navigate('/onboarding'); 
          break;
      }
    } else {
       console.log('RoleBasedRedirect: Onboarding complete, redirecting to dashboard...');
       switch (userRole) {
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'landlord':
          navigate('/landlord/dashboard');
          break;
        case 'contractor':
          navigate('/contractor/dashboard');
          break;
        default:
          console.log('RoleBasedRedirect - No recognized role after onboarding, redirecting to profile');
          navigate('/profile'); 
          break;
      }
    }
  // Depend on authLoading, currentUser, and userProfile
  }, [currentUser, userProfile, authLoading, navigate]);

  // Show loading while checking auth and profile
  if (authLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-propagentic-teal"></div>
      </div>
    );
  }

  // Render nothing once redirection logic is complete
  return null;
};

function App() {
  return (
    <AuthProvider>
      <ConnectionProvider>
        <DemoModeProvider>
          <DataServiceProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  {/* Redirect root to new landing page */}
                  <Route path="/" element={<Navigate to="/propagentic/new" replace />} />

                  {/* New Landing Page */}
                  <Route path="/propagentic/new" element={<EnhancedLandingPage />} />

                  {/* Keep old landing page temporarily (optional, can be removed later) */}
                  <Route path="/old-landing" element={<LandingPage />} />

                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/signup" element={<RegisterPage />} />
                  <Route path="/signup/contractor" element={<RegisterPage initialRole="contractor" />} />
                  <Route path="/signup/contractor-premium" element={<RegisterPage initialRole="contractor" isPremium={true} />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact-sales" element={<Navigate to="/pricing" state={{ openContactForm: true }} />} />
                  <Route path="/demo" element={<DemoPage />} />
                  
                  {/* AI Example Pages */}
                  <Route path="/ai-examples" element={<AIExamples />} />
                  <Route path="/ai-tutorial" element={<AITutorial />} />
                  
                  {/* UI Components Showcase Pages */}
                  <Route path="/ui-showcase" element={<ComponentsShowcasePage />} />
                  <Route path="/test-ui" element={<TestUIComponents />} />
                  <Route path="/ui-simple" element={<SimpleUIShowcase />} />

                  {/* Onboarding Routes */}
                  <Route path="/onboarding" element={
                    <PrivateRoute>
                      <OnboardingSurvey />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/landlord-onboarding" element={
                    <PrivateRoute>
                      <LandlordOnboarding />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/create-landlord-profile" element={
                    <PrivateRoute>
                      <CreateLandlordProfile />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/contractor-onboarding" element={
                    <PrivateRoute>
                      <ContractorOnboardingPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Protected Routes - Wrapped by DashboardLayout */}
                  <Route element={<DashboardLayout />}>             
                      {/* Profile Pages */}
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/contractor/profile" element={<ContractorProfilePage />} />
                      
                      {/* Notifications */}
                      <Route path="/notifications" element={<NotificationsPage />} />
                      
                      {/* Role-based redirect */}
                      <Route path="/dashboard" element={<RoleBasedRedirect />} />
                      
                      {/* Tenant Routes */}
                      <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                      
                      {/* Landlord Routes */}
                      <Route path="/landlord/dashboard" element={<LandlordTicketDashboard />} />
                      
                      {/* Contractor Routes */}
                      <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
                      <Route path="/contractor/jobs/:jobId" element={<JobDetailPage />} />
                      <Route path="/contractor/history" element={<JobHistoryPage />} />
                      
                      {/* Maintenance Routes */}
                      <Route path="/maintenance/new" element={<MaintenanceFormPage />} />
                      <Route path="/maintenance/my-requests" element={<MyMaintenanceRequestsPage />} />
                  </Route>
                  
                  {/* Auth Page */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Fallback/Not Found - Redirect to login */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </Router>
            </NotificationProvider>
          </DataServiceProvider>
        </DemoModeProvider>
      </ConnectionProvider>
    </AuthProvider>
  );
}

export default App;
