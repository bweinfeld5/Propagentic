import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

/**
 * AddPropertyModal Component
 * 
 * Modal form for adding a new property
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {function} onAdd - Function to handle adding a property
 */
const AddPropertyModal = ({ isOpen, onClose, onAdd }) => {
  const [property, setProperty] = useState({
    name: '',
    address: '',
    units: 1,
    occupancyRate: 0
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: name === 'units' ? parseInt(value, 10) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...property,
      id: Date.now().toString(), // Generate a temporary ID
    });
    // Reset form and close modal
    setProperty({
      name: '',
      address: '',
      units: 1,
      occupancyRate: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background dark:bg-background-darkSubtle rounded-lg shadow-xl max-w-md w-full border border-border dark:border-border-dark">
        <div className="flex justify-between items-center p-4 border-b border-border dark:border-border-dark">
          <h2 className="text-lg font-medium text-content dark:text-content-dark">Add New Property</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            icon={<XMarkIcon className="h-5 w-5" />}
            aria-label="Close modal"
            className="!p-1"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1">
                Property Name*
              </label>
              <input
                type="text"
                name="name"
                required
                value={property.name}
                onChange={handleChange}
                placeholder="e.g., Sunrise Apartments"
                className="w-full rounded-md border border-border dark:border-border-dark px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-background dark:bg-background-dark text-content dark:text-content-dark placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1">
                Address*
              </label>
              <input
                type="text"
                name="address"
                required
                value={property.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, City, State"
                className="w-full rounded-md border border-border dark:border-border-dark px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-background dark:bg-background-dark text-content dark:text-content-dark placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1">
                Number of Units*
              </label>
              <input
                type="number"
                name="units"
                required
                min="1"
                value={property.units}
                onChange={handleChange}
                className="w-full rounded-md border border-border dark:border-border-dark px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-background dark:bg-background-dark text-content dark:text-content-dark placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1">
                Current Occupancy Rate (%)
              </label>
              <input
                type="number"
                name="occupancyRate"
                min="0"
                max="100"
                value={property.occupancyRate}
                onChange={handleChange}
                className="w-full rounded-md border border-border dark:border-border-dark px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-background dark:bg-background-dark text-content dark:text-content-dark placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3 border-t border-border dark:border-border-dark pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Add Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal; 