#!/bin/bash

echo "Checking App.js for hidden characters..."
hexdump -C src/App.js

echo "Creating a clean version of App.js..."
cat > src/App.js.clean << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Authentication components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import OnboardingLayout from './components/layouts/OnboardingLayout';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';
import CreateTicket from './components/tickets/CreateTicket';

// Onboarding components
import OnboardingSelector from './components/onboarding/OnboardingSelector';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Onboarding Routes */}
          <Route element={<OnboardingLayout />}>
            <Route path="/onboarding" element={<OnboardingSelector />} />
          </Route>
          
          {/* Dashboard Routes - Protected by DashboardLayout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            {/* Add more protected routes here */}
          </Route>
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
EOL

echo "Moving clean version to App.js..."
mv src/App.js.clean src/App.js

echo "Done!" 