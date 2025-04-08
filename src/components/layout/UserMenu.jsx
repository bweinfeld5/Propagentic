import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCircleIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon as LogoutIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get user's initials for avatar
  const getInitials = () => {
    if (userProfile?.name) {
      return userProfile.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    }
    
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        type="button"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {userProfile?.photoURL ? (
          <img 
            src={userProfile.photoURL} 
            alt="Profile" 
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">{getInitials()}</span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <div className="px-4 py-3" role="none">
            <p className="text-sm font-medium text-gray-900 truncate" role="none">
              {userProfile?.name || currentUser?.email}
            </p>
            <p className="text-sm text-gray-500 truncate" role="none">
              {currentUser?.email}
            </p>
            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
              Tenant
            </span>
          </div>
          
          <div className="py-1" role="none">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              My Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <CogIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Settings
            </Link>
            <Link
              to="/support"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <QuestionMarkCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Support
            </Link>
          </div>
          
          <div className="py-1" role="none">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={handleLogout}
            >
              <LogoutIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 