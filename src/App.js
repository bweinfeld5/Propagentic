import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages & Components
import LandingPage from './components/landing/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Generic dashboard (may need removal/replacement)
import TenantDashboard from './pages/TenantDashboard.jsx';
import LandlordDashboard from './pages/LandlordDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import MaintenanceFormPage from './pages/MaintenanceFormPage';
import MyMaintenanceRequestsPage from './pages/MyMaintenanceRequestsPage';
import PricingPage from './pages/PricingPage';
import OnboardingSurvey from './components/onboarding/OnboardingSurvey'; // Tenant onboarding
import LandlordOnboarding from './components/onboarding/LandlordOnboarding'; // Landlord onboarding
import ContractorOnboardingPage from './pages/ContractorOnboardingPage'; // Contractor onboarding
import JobDetailPage from './pages/JobDetailPage'; // Job details
import JobHistoryPage from './pages/JobHistoryPage'; // Job history
import ContractorProfilePage from './pages/ContractorProfilePage'; // Contractor profile
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './components/layouts/DashboardLayout'; // Import the layout

// Route Guards (Consider simplifying if DashboardLayout handles auth checks)
const PrivateRoute = ({ children }) => {
  // This might be redundant if DashboardLayout handles auth redirect
  const { currentUser, loading } = useAuth(); // Assuming useAuth provides loading state
  
  if (loading) {
     return <div>Loading...</div>; // Or a spinner component
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Re-checking useAuth hook for loading state
import { useAuth } from './context/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Onboarding Routes - These should not be in DashboardLayout */}
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
              
              {/* User Type Specific Dashboards */}
              <Route path="/dashboard" element={<DashboardPage />} /> {/* Consider role-based redirect here or remove */}
              <Route path="/tenant" element={<TenantDashboard />} />
              <Route path="/landlord" element={<LandlordDashboard />} />
              <Route path="/contractor" element={<ContractorDashboard />} />
              
              {/* Contractor routes */}
              <Route path="/contractor/jobs/:jobId" element={<JobDetailPage />} />
              <Route path="/contractor/history" element={<JobHistoryPage />} />
              
              {/* Maintenance Routes */}
              <Route path="/maintenance/new" element={<MaintenanceFormPage />} />
              <Route path="/maintenance/my-requests" element={<MyMaintenanceRequestsPage />} />
              
              {/* Add other protected routes like /properties, /settings etc. here */}
          </Route>
          
          {/* Fallback/Not Found - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
