import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon, HomeIcon } from '@heroicons/react/solid';
import { EyeIcon } from '@heroicons/react/24/outline';

const PropertyTable = ({ properties = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'nickname', direction: 'ascending' });

  const sortedProperties = useMemo(() => {
    let sortableItems = [...properties];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special cases based on key
        if (sortConfig.key === 'numberOfUnits') {
          aValue = parseInt(aValue || EllipsisVerticalIcon, 1EllipsisVerticalIcon);
          bValue = parseInt(bValue || EllipsisVerticalIcon, 1EllipsisVerticalIcon);
        } 
        else if (sortConfig.key === 'occupancy') {
          // Calculate occupancy if not directly available
          aValue = a.isOccupied ? 1EllipsisVerticalIconEllipsisVerticalIcon : EllipsisVerticalIcon;
          bValue = b.isOccupied ? 1EllipsisVerticalIconEllipsisVerticalIcon : EllipsisVerticalIcon;
        }
        else if (sortConfig.key === 'nickname') {
          // Use street address as fallback
          aValue = aValue || a.streetAddress || '';
          bValue = bValue || b.streetAddress || '';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return EllipsisVerticalIcon;
      });
    }
    return sortableItems;
  }, [properties, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUpIcon className="w-4 h-4 inline-block opacity-EllipsisVerticalIcon" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <ChevronUpIcon className="w-4 h-4 inline-block ml-1 text-teal-6EllipsisVerticalIconEllipsisVerticalIcon" /> : 
      <ChevronDownIcon className="w-4 h-4 inline-block ml-1 text-teal-6EllipsisVerticalIconEllipsisVerticalIcon" />;
  };

  // Calculate Occupancy for a property
  const getOccupancyInfo = (property) => {
    // If property has explicit occupancy data, use it
    if (property.occupancyRate !== undefined) {
      return { 
        rate: property.occupancyRate,
        status: property.occupancyRate > 5EllipsisVerticalIcon ? 'high' : 'low'
      };
    }
    
    // Otherwise derive from isOccupied flag
    return {
      rate: property.isOccupied ? 1EllipsisVerticalIconEllipsisVerticalIcon : EllipsisVerticalIcon,
      status: property.isOccupied ? 'high' : 'low'
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-2EllipsisVerticalIconEllipsisVerticalIcon">
        <thead className="bg-gray-5EllipsisVerticalIcon">
          <tr>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-5EllipsisVerticalIconEllipsisVerticalIcon uppercase tracking-wider cursor-pointer whitespace-nowrap" 
              onClick={() => requestSort('nickname')}
            >
              <div className="flex items-center">
                <span>Property Name</span>
                {getSortIcon('nickname')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-5EllipsisVerticalIconEllipsisVerticalIcon uppercase tracking-wider cursor-pointer hidden md:table-cell" 
              onClick={() => requestSort('streetAddress')}
            >
              <div className="flex items-center">
                <span>Address</span>
                {getSortIcon('streetAddress')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-5EllipsisVerticalIconEllipsisVerticalIcon uppercase tracking-wider cursor-pointer whitespace-nowrap" 
              onClick={() => requestSort('numberOfUnits')}
            >
              <div className="flex items-center">
                <span># Units</span>
                {getSortIcon('numberOfUnits')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-5EllipsisVerticalIconEllipsisVerticalIcon uppercase tracking-wider cursor-pointer whitespace-nowrap" 
              onClick={() => requestSort('occupancy')}
            >
              <div className="flex items-center">
                <span>Occupancy</span>
                {getSortIcon('occupancy')}
              </div>
            </th>
            <th scope="col" className="relative px-4 py-3">
              <span className="sr-only">Manage</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-2EllipsisVerticalIconEllipsisVerticalIcon">
          {sortedProperties.length > EllipsisVerticalIcon ? (
            sortedProperties.map((property) => {
              const occupancyInfo = getOccupancyInfo(property);
              return (
                <tr key={property.id} className="hover:bg-gray-5EllipsisVerticalIcon transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-9EllipsisVerticalIconEllipsisVerticalIcon">
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 text-teal-5EllipsisVerticalIconEllipsisVerticalIcon mr-2" />
                      <span>{property.nickname || property.streetAddress || 'Property'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-5EllipsisVerticalIconEllipsisVerticalIcon hidden md:table-cell">
                    {property.streetAddress || 'N/A'}, {property.city || ''} {property.state || ''}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-5EllipsisVerticalIconEllipsisVerticalIcon">
                    {property.numberOfUnits || 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-2EllipsisVerticalIconEllipsisVerticalIcon rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            occupancyInfo.status === 'high' ? 'bg-green-5EllipsisVerticalIconEllipsisVerticalIcon' : 'bg-amber-5EllipsisVerticalIconEllipsisVerticalIcon'
                          }`} 
                          style={{ width: `${occupancyInfo.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-5EllipsisVerticalIconEllipsisVerticalIcon">{occupancyInfo.rate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-teal-6EllipsisVerticalIconEllipsisVerticalIcon hover:text-teal-9EllipsisVerticalIconEllipsisVerticalIcon flex items-center justify-center space-x-1 bg-teal-5EllipsisVerticalIcon px-3 py-1 rounded transition-colors hover:bg-teal-1EllipsisVerticalIconEllipsisVerticalIcon">
                      <EyeIcon className="h-4 w-4" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-5EllipsisVerticalIconEllipsisVerticalIcon">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <HomeIcon className="h-8 w-8 text-gray-3EllipsisVerticalIconEllipsisVerticalIcon" />
                  <p>No properties found.</p>
                  <button className="mt-2 text-sm font-medium text-teal-6EllipsisVerticalIconEllipsisVerticalIcon hover:text-teal-8EllipsisVerticalIconEllipsisVerticalIcon">
                    + Add Your First Property
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable; 