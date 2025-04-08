import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/shared/NotificationProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';

// Pages & Components
import LandingPage from './components/landing/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// New Components
import TenantDashboard from './components/tenant/TenantDashboard';
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Check both userType and role fields for backward compatibility
          const userRole = userData.userType || userData.role;
          console.log(`RoleBasedRedirect - User role detected: ${userRole}`);
          
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
              console.log('RoleBasedRedirect - No recognized role, redirecting to profile');
              navigate('/profile');
              break;
          }
        } else {
          // No user document found, redirect to profile
          navigate('/profile');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    
    redirectBasedOnRole();
  }, [currentUser, navigate]);

  // Show loading while checking role
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/new" element={<EnhancedLandingPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
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
    </AuthProvider>
  );
}

export default App;
