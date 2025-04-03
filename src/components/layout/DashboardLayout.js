import React, { useState } from 'react';
import { Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { currentUser, userProfile, logout, isLandlord, isTenant, isContractor } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wait for user profile to load
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Helper to generate nav item classes
  const getNavItemClasses = (path) => {
    return `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      location.pathname === path
        ? 'bg-indigo-800 text-white'
        : 'text-indigo-100 hover:bg-indigo-600'
    }`;
  };

  // Helper to determine active navigation item
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-propagentic-teal text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  // Log out the user
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 transition-opacity bg-gray-500 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-center h-16 px-6 bg-white border-b border-gray-200">
          <Link to="/dashboard" className="text-xl font-semibold text-propagentic-teal">
            Propagentic
          </Link>
        </div>

        <div className="overflow-y-auto h-full">
          <nav className="px-3 mt-6 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link
              to="/maintenance/my-requests"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/maintenance/my-requests')}`}
            >
              My Maintenance Requests
            </Link>
            <Link
              to="/maintenance/new"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/maintenance/new')}`}
            >
              New Maintenance Request
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-propagentic-teal lg:hidden"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Mobile sidebar component
const MobileSidebar = ({ userProfile, getNavItemClasses, isLandlord, isTenant, isContractor, handleLogout }) => (
  <div className="h-0 flex-1 flex flex-col pt-5 overflow-y-auto">
    <div className="flex items-center flex-shrink-0 px-4">
      <span className="text-white font-bold text-xl">PropManage AI</span>
    </div>
    <nav className="mt-5 px-2 space-y-1">
      <CommonNavItems 
        getNavItemClasses={getNavItemClasses} 
        isLandlord={isLandlord} 
        isTenant={isTenant} 
        isContractor={isContractor} 
      />
    </nav>
    <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
      <div className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-9 w-9 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.email)}&background=6366F1&color=fff`}
              alt="Profile"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{userProfile.name || userProfile.email}</p>
            <button onClick={handleLogout} className="text-xs font-medium text-indigo-200 hover:text-white">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Desktop sidebar component
const DesktopSidebar = ({ userProfile, getNavItemClasses, isLandlord, isTenant, isContractor, handleLogout }) => (
  <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
    <div className="flex items-center flex-shrink-0 px-4">
      <span className="text-white font-bold text-xl">PropManage AI</span>
    </div>
    <nav className="mt-5 flex-1 px-2 space-y-1">
      <CommonNavItems 
        getNavItemClasses={getNavItemClasses} 
        isLandlord={isLandlord} 
        isTenant={isTenant} 
        isContractor={isContractor} 
      />
    </nav>
    <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
      <div className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-9 w-9 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.email)}&background=6366F1&color=fff`}
              alt="Profile"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{userProfile.name || userProfile.email}</p>
            <p className="text-xs font-medium text-indigo-200">Role: {userProfile.userType}</p>
            <button onClick={handleLogout} className="text-xs font-medium text-indigo-200 hover:text-white">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Common navigation items based on user role
const CommonNavItems = ({ getNavItemClasses, isLandlord, isTenant, isContractor }) => (
  <>
    <Link to="/dashboard" className={getNavItemClasses('/dashboard')}>
      <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Dashboard
    </Link>

    {/* Tenant-specific links */}
    {isTenant() && (
      <>
        <Link to="/maintenance/new" className={getNavItemClasses('/maintenance/new')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Request
        </Link>
        <Link to="/maintenance/my-requests" className={getNavItemClasses('/maintenance/my-requests')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Requests
        </Link>
      </>
    )}

    {/* Landlord-specific links */}
    {isLandlord() && (
      <>
        <Link to="/properties" className={getNavItemClasses('/properties')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Properties
        </Link>
        <Link to="/tenants" className={getNavItemClasses('/tenants')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Tenants
        </Link>
        <Link to="/contractors" className={getNavItemClasses('/contractors')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Contractors
        </Link>
        <Link to="/maintenance/all" className={getNavItemClasses('/maintenance/all')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          All Requests
        </Link>
      </>
    )}

    {/* Contractor-specific links */}
    {isContractor() && (
      <>
        <Link to="/maintenance/assigned" className={getNavItemClasses('/maintenance/assigned')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Assigned Jobs
        </Link>
        <Link to="/maintenance/completed" className={getNavItemClasses('/maintenance/completed')}>
          <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Completed Jobs
        </Link>
      </>
    )}

    <Link to="/profile" className={getNavItemClasses('/profile')}>
      <svg className="mr-3 h-6 w-6 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Profile
    </Link>
  </>
);

export default DashboardLayout; 