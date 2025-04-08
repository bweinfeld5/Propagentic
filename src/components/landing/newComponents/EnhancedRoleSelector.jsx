import React from 'react';
import { motion } from 'framer-motion';

const EnhancedRoleSelector = ({ roles, selectedRole, setSelectedRole }) => {
  // Helper function to get icon based on role
  const getRoleIcon = (role) => {
    if (role === 'Landlord') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    }
    if (role === 'Tenant') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    if (role === 'Contractor') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-propagentic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    }
    return null;
  };

  // Helper function to get role description
  const getRoleDescription = (role) => {
    switch (role) {
      case 'Landlord': return 'Manage properties, collect rent, and handle maintenance requests efficiently.';
      case 'Tenant': return 'Pay rent online, submit maintenance requests, and communicate with your landlord.';
      case 'Contractor': return 'Receive job requests, communicate with property managers, and get paid quickly.';
      default: return '';
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {roles.map((role) => (
        <motion.div
          key={role}
          className={`relative cursor-pointer group`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedRole(role)}
        >
          <div 
            className={`w-64 p-6 rounded-xl transition-all duration-300 ${
              selectedRole === role 
                ? 'bg-propagentic-neutral-lightest shadow-card dark:bg-propagentic-neutral-dark border-2 border-propagentic-teal' 
                : 'bg-propagentic-neutral-lightest/80 shadow-md hover:shadow-card-hover dark:bg-propagentic-neutral-dark/80 border-2 border-transparent'
            }`}
          >
            <div className="mb-4 relative">
              <div className={`rounded-full p-3 inline-block ${
                selectedRole === role 
                  ? 'bg-propagentic-teal bg-opacity-10'
                  : 'bg-propagentic-neutral-light dark:bg-propagentic-neutral group-hover:bg-propagentic-teal/5'
              } transition-colors duration-200`}>
                {getRoleIcon(role)}
              </div>
              
              {selectedRole === role && (
                <motion.div 
                  className="absolute -right-1 -top-1 bg-propagentic-teal text-propagentic-neutral-lightest p-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
            
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
              selectedRole === role 
                ? 'text-propagentic-teal' 
                : 'text-propagentic-slate-dark dark:text-propagentic-neutral-lightest group-hover:text-propagentic-teal'
            }`}>
              {role}
            </h3>
            
            <p className={`text-sm ${
              selectedRole === role 
                ? 'text-propagentic-slate' 
                : 'text-propagentic-slate dark:text-propagentic-neutral-light'
            }`}>
              {getRoleDescription(role)}
            </p>
          </div>
          
          {selectedRole === role && (
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12L0 0H24L12 12Z" className="fill-current text-propagentic-teal" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedRoleSelector; 