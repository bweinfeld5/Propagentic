import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Welcome to your dashboard.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 