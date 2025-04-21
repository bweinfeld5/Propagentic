import React from 'react';
import DashboardDemo from '../components/dashboard/DashboardDemo';

const DashboardPage = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-propagentic-slate-dark dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back to your PropAgentic dashboard</p>
      </div>
      
      <DashboardDemo />
    </div>
  );
};

export default DashboardPage; 