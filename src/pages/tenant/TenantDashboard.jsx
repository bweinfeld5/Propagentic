import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import LeaseInfoCard from '../../components/tenant/LeaseInfoCard';
import TenantMaintenanceRequestCard from '../../components/tenant/TenantMaintenanceRequestCard';
import Button from '../../components/ui/Button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

// Mock Data (replace with actual data fetching later)
const initialTenantRequests = [
  {
    id: 'T1',
    description: 'Leaking faucet in bathroom sink',
    status: 'Submitted',
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'T2',
    description: 'Heating not working in bedroom',
    status: 'In Progress',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    assignedTo: 'Cooling Bros HVAC'
  },
  {
    id: 'T3',
    description: 'Front door lock is sticky',
    status: 'Completed',
    submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    assignedTo: 'LockMasters Inc.'
  }
];

const TenantDashboard = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState(initialTenantRequests);

  // Placeholder for handling new request submission
  const handleNewRequest = () => {
    // TODO: Navigate to new request form or open a modal
    alert('Navigate to new maintenance request form...');
  };

  return (
    <DashboardLayout>
      {/* Apply theme background colors */}
      <div className="p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark min-h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-content dark:text-content-dark">
            Tenant Dashboard
          </h1>
          <p className="mt-1 text-sm text-content-secondary dark:text-content-darkSecondary">
            Welcome! Manage your lease, payments, and maintenance requests here.
          </p>
        </div>

        {/* Dashboard Content - Use Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Lease Info & Quick Links (Example) */}
          <div className="lg:col-span-1 space-y-6">
            <LeaseInfoCard /> 
            {/* Quick Links Section */}
            <div className="bg-background-subtle dark:bg-background-darkSubtle p-6 rounded-lg border border-border dark:border-border-dark shadow-sm">
             <h2 className="text-lg font-medium text-content dark:text-content-dark mb-4">Quick Links</h2>
             <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => alert('Contact Landlord clicked')}>Contact Landlord</Button>
                <Button variant="outline" size="sm" onClick={() => alert('View Lease clicked')}>View Lease Document</Button>
                <Button variant="outline" size="sm" onClick={() => alert('Payment History clicked')}>Payment History</Button>
             </div>
           </div>
          </div>

          {/* Column 2: Maintenance Requests */}
          <div className="lg:col-span-2">
            <div className="bg-background-subtle dark:bg-background-darkSubtle p-6 rounded-lg border border-border dark:border-border-dark shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-content dark:text-content-dark">My Maintenance Requests</h2>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleNewRequest}
                  icon={<PlusCircleIcon className="h-5 w-5" />}
                >
                  Submit New Request
                </Button>
              </div>
              <div className="space-y-4">
                {maintenanceRequests.length > 0 ? (
                  maintenanceRequests.map(request => (
                    <TenantMaintenanceRequestCard key={request.id} request={request} />
                  ))
                ) : (
                  <p className="text-center text-content-subtle dark:text-content-darkSubtle py-4">
                    You haven't submitted any maintenance requests yet.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard; 