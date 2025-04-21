import React, { useState } from 'react';
import {
  HomeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

/**
 * PropertyCard Component
 * 
 * Displays property information with inline editing capabilities
 * 
 * @param {object} property - The property object
 * @param {function} onUpdate - Callback when property is updated
 * @param {function} onDelete - Callback when property is deleted
 */
const PropertyCard = ({ property, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState({ ...property });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProperty(prev => ({
      ...prev,
      [name]: name === 'units' ? parseInt(value, 10) || 0 : value
    }));
  };

  // Save changes
  const handleSave = () => {
    onUpdate(editedProperty);
    setIsEditing(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setEditedProperty({ ...property });
    setIsEditing(false);
  };

  return (
    <div className="bg-background dark:bg-background-darkSubtle rounded-lg shadow-sm border border-border dark:border-border-dark p-5 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
            <HomeIcon className="h-5 w-5 text-primary dark:text-primary-light" />
          </div>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedProperty.name}
              onChange={handleChange}
              className="border-b border-primary focus:outline-none text-lg font-medium bg-transparent text-content dark:text-content-dark"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-medium text-content dark:text-content-dark">{property.name}</h3>
          )}
        </div>
        
        <div className="flex space-x-1.5">
          {isEditing ? (
            <>
              <Button variant="success" size="xs" onClick={handleSave} icon={<CheckIcon className="h-4 w-4"/>} aria-label="Save" />
              <Button variant="danger" size="xs" onClick={handleCancel} icon={<XMarkIcon className="h-4 w-4"/>} aria-label="Cancel" />
            </>
          ) : (
            <>
              <Button variant="ghost" size="xs" onClick={() => setIsEditing(true)} icon={<PencilIcon className="h-4 w-4"/>} aria-label="Edit" />
              <Button variant="ghost" size="xs" onClick={() => onDelete(property.id)} icon={<TrashIcon className="h-4 w-4 text-danger dark:text-red-400 hover:text-danger/80 dark:hover:text-red-300"/>} aria-label="Delete" />
            </>
          )}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-content-secondary dark:text-content-darkSecondary mb-1">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={editedProperty.address}
              onChange={handleChange}
              className="w-full rounded-md border border-border dark:border-border-dark px-3 py-1 text-sm bg-background dark:bg-background-dark text-content dark:text-content-dark focus:ring-primary focus:border-primary"
            />
          ) : (
            <p className="text-sm text-content dark:text-content-dark">{property.address}</p>
          )}
        </div>
        
        <div className="flex space-x-4">
          <div>
            <label className="block text-xs font-medium text-content-secondary dark:text-content-darkSecondary mb-1">
              Units
            </label>
            {isEditing ? (
              <input
                type="number"
                name="units"
                min="1"
                value={editedProperty.units}
                onChange={handleChange}
                className="w-20 rounded-md border border-border dark:border-border-dark px-3 py-1 text-sm bg-background dark:bg-background-dark text-content dark:text-content-dark focus:ring-primary focus:border-primary"
              />
            ) : (
              <p className="text-sm text-content dark:text-content-dark">{property.units}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-content-secondary dark:text-content-darkSecondary mb-1">
              Occupancy
            </label>
            <p className="text-sm text-content dark:text-content-dark">
              {property.occupancyRate || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 