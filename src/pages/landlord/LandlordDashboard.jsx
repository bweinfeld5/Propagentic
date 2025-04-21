import React, { useState } from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  PresentationChartLineIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/landlord/StatCard';
import MaintenanceRequestCard from '../../components/landlord/MaintenanceRequestCard';
import PropertyCard from '../../components/landlord/PropertyCard';
import AddPropertyModal from '../../components/landlord/AddPropertyModal';
import Button from '../../components/ui/Button';

const LandlordDashboard = () => {
  // Mock data for properties
  const [properties, setProperties] = useState([
    {
      id: '1',
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd, Los Angeles, CA',
      units: 20,
      occupancyRate: 95
    },
    {
      id: '2',
      name: 'Ocean View Condos',
      address: '456 Beach Road, Malibu, CA',
      units: 15,
      occupancyRate: 87
    },
    {
      id: '3',
      name: 'Downtown Lofts',
      address: '789 Main Street, San Francisco, CA',
      units: 9,
      occupancyRate: 91
    }
  ]);

  // Mock data for maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    {
      id: '1',
      description: 'Leaking faucet in Unit 101',
      location: 'Sunset Apartments, Unit 101',
      status: 'new',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      assignedTo: null
    },
    {
      id: '2',
      description: 'Broken thermostat in Unit 205',
      location: 'Ocean View Condos, Unit 205',
      status: 'assigned',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      assignedTo: 'Mike Thompson'
    },
    {
      id: '3',
      description: 'Ceiling fan not working',
      location: 'Downtown Lofts, Unit 304',
      status: 'in_progress',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      assignedTo: 'Sarah Johnson'
    }
  ]);

  // State for add property modal
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

  // Calculate total units
  const totalUnits = properties.reduce((sum, property) => sum + property.units, 0);
  
  // Calculate average occupancy rate
  const averageOccupancyRate = Math.round(
    properties.reduce((sum, property) => sum + property.occupancyRate, 0) / properties.length
  );

  // Handle maintenance request status change
  const handleMaintenanceStatusChange = (requestId, newStatus) => {
    setMaintenanceRequests(prevRequests =>
      prevRequests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  // Handle adding a new property
  const handleAddProperty = (newProperty) => {
    setProperties(prevProperties => [...prevProperties, newProperty]);
  };

  // Handle updating a property
  const handleUpdateProperty = (updatedProperty) => {
    setProperties(prevProperties =>
      prevProperties.map(property => 
        property.id === updatedProperty.id ? updatedProperty : property
      )
    );
  };

  // Handle deleting a property
  const handleDeleteProperty = (propertyId) => {
    setProperties(prevProperties => 
      prevProperties.filter(property => property.id !== propertyId)
    );
  };

  return (
    <DashboardLayout>
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        </div>

        {/* Stats Overview - Use variants for StatCard */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard 
            title="Total Properties" 
            value={properties.length} 
            icon={HomeIcon} 
            variant="primary" // Use primary (teal)
          />
          <StatCard 
            title="Total Units" 
            value={totalUnits} 
            icon={BuildingOfficeIcon} 
            variant="info" // Use info (blue)
          />
          <StatCard 
            title="Occupancy Rate" 
            value={`${averageOccupancyRate}%`} 
            icon={PresentationChartLineIcon} 
            variant="success" // Use success (green)
          />
          <StatCard 
            title="Maintenance Requests" 
            value={maintenanceRequests.length} 
            icon={UsersIcon} // Consider a wrench or clipboard icon?
            variant="warning" // Use warning (amber)
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Maintenance Requests - Apply theme colors */}
          <div className="lg:col-span-2">
            <div className="bg-background dark:bg-background-darkSubtle shadow-sm rounded-lg p-6 border border-border dark:border-border-dark">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-content dark:text-content-dark">Recent Maintenance Requests</h2>
                <span className="text-sm text-content-secondary dark:text-content-darkSecondary">{maintenanceRequests.length} requests</span>
              </div>
              {/* MaintenanceRequestCard needs refactoring */}
              <div className="space-y-4">
                {maintenanceRequests.map(request => (
                  <MaintenanceRequestCard 
                    key={request.id}
                    request={request}
                    onStatusChange={handleMaintenanceStatusChange}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* My Properties - Apply theme colors */}
          <div className="lg:col-span-1">
            <div className="bg-background dark:bg-background-darkSubtle shadow-sm rounded-lg p-6 border border-border dark:border-border-dark">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-content dark:text-content-dark">My Properties</h2>
                {/* Use new Button component */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddPropertyModalOpen(true)}
                  icon={<PlusCircleIcon className="h-5 w-5"/>}
                >
                  Add Property
                </Button>
              </div>
              {/* PropertyCard needs refactoring */}
              <div className="space-y-4">
                {properties.map(property => (
                  <PropertyCard 
                    key={property.id}
                    property={property}
                    onUpdate={handleUpdateProperty}
                    onDelete={handleDeleteProperty}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Property Modal */}
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onAdd={handleAddProperty}
      />
    </DashboardLayout>
  );
};

export default LandlordDashboard; 