import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon,
  ClipboardDocumentCheckIcon as ClipboardCheckIcon, 
  QuestionMarkCircleIcon,
  Cog6ToothIcon as CogIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingOfficeIcon as OfficeBuildingIcon,
  EnvelopeIcon as MailIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const SidebarNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Define navigation items based on user type
  const navigation = useMemo(() => {
    // Get user type from either userType or role field
    const userType = userProfile?.userType || userProfile?.role;
    console.log('SidebarNav - User type/role for navigation:', userType);
    
    // Common navigation items for all users
    const commonItems = [
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
      { name: 'Support', href: '/support', icon: QuestionMarkCircleIcon },
      { name: 'Settings', href: '/settings', icon: CogIcon },
    ];
    
    // Tenant-specific navigation
    if (userType === 'tenant') {
      return [
        { name: 'Dashboard', href: '/tenant/dashboard', icon: HomeIcon },
        { name: 'Maintenance', href: '/maintenance/my-requests', icon: ClipboardCheckIcon },
        ...commonItems
      ];
    }
    
    // Landlord-specific navigation
    else if (userType === 'landlord') {
      return [
        { name: 'Dashboard', href: '/landlord/dashboard', icon: HomeIcon },
        { name: 'Properties', href: '/landlord/properties', icon: OfficeBuildingIcon },
        { name: 'Tenants', href: '/landlord/tenants', icon: UsersIcon },
        { name: 'Maintenance', href: '/landlord/maintenance', icon: ClipboardCheckIcon },
        ...commonItems
      ];
    }
    
    // Contractor-specific navigation
    else if (userType === 'contractor') {
      return [
        { name: 'Dashboard', href: '/contractor/dashboard', icon: HomeIcon },
        { name: 'Job History', href: '/contractor/history', icon: ClockIcon },
        { name: 'Profile', href: '/contractor/profile', icon: UserCircleIcon },
        { name: 'Support', href: '/support', icon: QuestionMarkCircleIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon },
      ];
    }
    
    // Default navigation for other user types or when userType is undefined
    return [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      ...commonItems
    ];
  }, [userProfile]);

  // Check if the current path matches the nav item
  const isActive = (path) => {
    const userRole = userProfile?.userType || userProfile?.role;
    const dashboardPath = `/${userRole}/dashboard`;
    
    if (path === dashboardPath && location.pathname === path) {
      return true;
    }
    return location.pathname.startsWith(path) && path !== dashboardPath;
  };

  // Get classes for nav item based on active state
  const getNavItemClasses = (path) => {
    const baseClasses = "group flex items-center px-3 py-2 text-sm font-medium rounded-md";
    
    if (isActive(path)) {
      return `${baseClasses} bg-teal-800 text-white`;
    }
    return `${baseClasses} text-teal-100 hover:bg-teal-700 hover:text-white`;
  };

  // User's display name - show name if available, otherwise email
  const userDisplayName = useMemo(() => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return userProfile?.email || currentUser?.email || 'User';
  }, [userProfile, currentUser]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          type="button"
          className="p-2 rounded-md bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#176B5D]">
            <div className="px-4 pt-5 pb-4 sm:px-6">
              <h2 className="text-lg font-medium text-white">Propagentic</h2>
            </div>
            
            {/* User info in mobile view */}
            <div className="px-4 py-2 border-b border-teal-700">
              <div className="text-sm font-semibold text-white">{userDisplayName}</div>
              <div className="text-xs text-teal-200 capitalize">{userProfile?.userType || userProfile?.role || 'User'}</div>
            </div>
            
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={getNavItemClasses(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-700 hover:text-white"
                >
                  <LogoutIcon className="mr-4 h-6 w-6" aria-hidden="true" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-[#176B5D]">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-xl font-bold text-white">Propagentic</h2>
            </div>
            
            {/* User info in desktop view */}
            <div className="px-4 py-4 mt-2 border-b border-teal-700">
              <div className="text-sm font-semibold text-white">{userDisplayName}</div>
              <div className="text-xs text-teal-200 capitalize">{userProfile?.userType || userProfile?.role || 'User'}</div>
            </div>
            
            <nav className="mt-6 flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={getNavItemClasses(item.href)}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Logout button */}
            <div className="px-4 py-4 border-t border-teal-700 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-700 hover:text-white"
              >
                <LogoutIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNav; 