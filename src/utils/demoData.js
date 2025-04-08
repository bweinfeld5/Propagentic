/**
 * Helper functions for generating and loading mock data for demo mode
 */

// Sample property data
export const demoProperties = [
  {
    id: 'demo-property-1',
    name: 'Oakwood Apartments',
    address: '123 Main Street, Suite 4B, San Francisco, CA 94107',
    landlordId: 'demo-landlord-123',
    tenants: ['demo-tenant-123', 'demo-tenant-456'],
    units: 24,
    occupiedUnits: 20,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    updatedAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    propertyType: 'apartment',
    yearBuilt: 2010,
    lastInspection: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: 'demo-property-2',
    name: 'Sunset Townhomes',
    address: '456 Park Avenue, San Francisco, CA 94107',
    landlordId: 'demo-landlord-123',
    tenants: ['demo-tenant-789'],
    units: 12,
    occupiedUnits: 10,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    propertyType: 'townhouse',
    yearBuilt: 2015,
    lastInspection: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
  },
  {
    id: 'demo-property-3',
    name: 'Marina Bay Condos',
    address: '789 Ocean Drive, San Francisco, CA 94107',
    landlordId: 'demo-landlord-123',
    tenants: [],
    units: 8,
    occupiedUnits: 5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    propertyType: 'condominium',
    yearBuilt: 2018,
    lastInspection: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  }
];

// Sample tenant data
export const demoTenants = [
  {
    id: 'demo-tenant-123',
    displayName: 'Jessica Chen',
    email: 'demo-tenant1@propagentic.com',
    userType: 'tenant',
    propertyId: 'demo-property-1',
    propertyName: 'Oakwood Apartments',
    unitNumber: '4B',
    moveInDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    leaseEndDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000), // 185 days from now
    contactPhone: '555-123-4567',
    photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  {
    id: 'demo-tenant-456',
    displayName: 'Michael Rodriguez',
    email: 'demo-tenant2@propagentic.com',
    userType: 'tenant',
    propertyId: 'demo-property-1',
    propertyName: 'Oakwood Apartments',
    unitNumber: '2A',
    moveInDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    leaseEndDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 275 days from now
    contactPhone: '555-987-6543',
    photoURL: 'https://randomuser.me/api/portraits/men/42.jpg',
  },
  {
    id: 'demo-tenant-789',
    displayName: 'Emily Johnson',
    email: 'demo-tenant3@propagentic.com',
    userType: 'tenant',
    propertyId: 'demo-property-2',
    propertyName: 'Sunset Townhomes',
    unitNumber: '101',
    moveInDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    leaseEndDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000), // 320 days from now
    contactPhone: '555-555-5555',
    photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
  }
];

// Sample contractor data
export const demoContractors = [
  {
    id: 'demo-contractor-123',
    displayName: 'Chen Plumbing & Repair',
    email: 'demo-contractor1@propagentic.com',
    userType: 'contractor',
    specialties: ['plumbing', 'general_maintenance'],
    servicesDescription: 'Licensed plumber specializing in residential and commercial plumbing repairs and installations.',
    rating: 4.8,
    completedJobs: 42,
    responseTimeHours: 3,
    contactPhone: '555-765-4321',
    serviceRadius: 25, // miles
    workingHours: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: null // closed
    },
    photoURL: 'https://randomuser.me/api/portraits/men/29.jpg',
  },
  {
    id: 'demo-contractor-456',
    displayName: 'Rodriguez Electric',
    email: 'demo-contractor2@propagentic.com',
    userType: 'contractor',
    specialties: ['electrical'],
    servicesDescription: 'Licensed electrician with 15+ years of experience in residential electrical work.',
    rating: 4.9,
    completedJobs: 78,
    responseTimeHours: 4,
    contactPhone: '555-789-0123',
    serviceRadius: 30, // miles
    workingHours: {
      monday: { start: '07:00', end: '16:00' },
      tuesday: { start: '07:00', end: '16:00' },
      wednesday: { start: '07:00', end: '16:00' },
      thursday: { start: '07:00', end: '16:00' },
      friday: { start: '07:00', end: '14:00' },
      saturday: null, // closed
      sunday: null // closed
    },
    photoURL: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    id: 'demo-contractor-789',
    displayName: 'West Coast HVAC Services',
    email: 'demo-contractor3@propagentic.com',
    userType: 'contractor',
    specialties: ['hvac', 'appliance_repair'],
    servicesDescription: 'HVAC technicians specializing in heating, cooling, and ventilation systems.',
    rating: 4.7,
    completedJobs: 56,
    responseTimeHours: 5,
    contactPhone: '555-234-5678',
    serviceRadius: 20, // miles
    workingHours: {
      monday: { start: '08:30', end: '17:30' },
      tuesday: { start: '08:30', end: '17:30' },
      wednesday: { start: '08:30', end: '17:30' },
      thursday: { start: '08:30', end: '17:30' },
      friday: { start: '08:30', end: '17:30' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: null // closed
    },
    photoURL: 'https://randomuser.me/api/portraits/women/55.jpg',
  }
];

// Sample maintenance tickets
export const demoTickets = [
  {
    id: 'demo-ticket-1',
    tenantId: 'demo-tenant-123',
    tenantName: 'Jessica Chen',
    landlordId: 'demo-landlord-123',
    contractorId: 'demo-contractor-123',
    contractorName: 'Chen Plumbing & Repair',
    propertyId: 'demo-property-1',
    propertyName: 'Oakwood Apartments',
    unitNumber: '4B',
    status: 'in_progress',
    issueType: 'plumbing',
    urgencyLevel: 'high',
    description: 'Bathroom sink is leaking and water is collecting under the cabinet. The area around the pipe connection appears to be wet.',
    photos: [
      'https://images.unsplash.com/photo-1584677626646-7c8f83690304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    progressUpdates: [
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        message: 'I've inspected the leak. It's coming from the P-trap connection. Will need to replace the gasket and possibly the trap assembly.',
        progressPercent: 25,
        photos: [],
        contractorId: 'demo-contractor-123'
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        message: 'Parts have been ordered and will arrive tomorrow. Will schedule the repair for tomorrow afternoon.',
        progressPercent: 50,
        photos: [],
        contractorId: 'demo-contractor-123'
      }
    ]
  },
  {
    id: 'demo-ticket-2',
    tenantId: 'demo-tenant-456',
    tenantName: 'Michael Rodriguez',
    landlordId: 'demo-landlord-123',
    contractorId: 'demo-contractor-456',
    contractorName: 'Rodriguez Electric',
    propertyId: 'demo-property-1',
    propertyName: 'Oakwood Apartments',
    unitNumber: '2A',
    status: 'completed',
    issueType: 'electrical',
    urgencyLevel: 'medium',
    description: 'Kitchen outlets not working. I've checked the breaker and it doesn't appear to be tripped.',
    photos: [
      'https://images.unsplash.com/photo-1558389186-438424b00a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    progressUpdates: [
      {
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        message: 'Inspected the kitchen outlets. Found that the GFCI outlet is tripped. Will replace it as it appears worn.',
        progressPercent: 50,
        photos: [],
        contractorId: 'demo-contractor-456'
      },
      {
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        message: 'Replaced the faulty GFCI outlet and tested all kitchen outlets. Everything is working properly now.',
        progressPercent: 100,
        photos: [
          'https://images.unsplash.com/photo-1590601655722-eb4a92f9539b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
        ],
        contractorId: 'demo-contractor-456'
      }
    ],
    feedback: {
      rating: 5,
      comment: 'Quick and professional service. Fixed the problem in one visit!',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    }
  },
  {
    id: 'demo-ticket-3',
    tenantId: 'demo-tenant-789',
    tenantName: 'Emily Johnson',
    landlordId: 'demo-landlord-123',
    propertyId: 'demo-property-2',
    propertyName: 'Sunset Townhomes',
    unitNumber: '101',
    status: 'ready_to_dispatch',
    issueType: 'hvac',
    urgencyLevel: 'low',
    description: 'Air conditioning is not cooling efficiently. It runs constantly but the temperature doesn't drop below 78 degrees.',
    photos: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    aiClassification: {
      category: 'hvac',
      confidence: 0.92,
      suggestedPriority: 'medium',
      suggestedContractors: ['demo-contractor-789']
    }
  },
  {
    id: 'demo-ticket-4',
    tenantId: 'demo-tenant-123',
    tenantName: 'Jessica Chen',
    landlordId: 'demo-landlord-123',
    propertyId: 'demo-property-1',
    propertyName: 'Oakwood Apartments',
    unitNumber: '4B',
    status: 'pending_classification',
    issueType: 'other',
    urgencyLevel: 'low',
    description: 'Window in bedroom has a small crack in the corner. Not urgent but should be looked at.',
    photos: [
      'https://images.unsplash.com/photo-1616485506360-d52ee560f649?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    ],
    createdAt: new Date(), // Just created
    updatedAt: new Date() // Just updated
  }
];

// Sample landlord profile
export const demoLandlordProfile = {
  id: 'demo-landlord-123',
  displayName: 'Alex Thompson',
  email: 'demo-landlord@propagentic.com',
  userType: 'landlord',
  photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
  contactPhone: '555-321-9876',
  company: 'Thompson Property Management',
  properties: ['demo-property-1', 'demo-property-2', 'demo-property-3'],
  contractors: ['demo-contractor-123', 'demo-contractor-456', 'demo-contractor-789'],
  metrics: {
    totalProperties: 3,
    totalUnits: 44,
    occupancyRate: 0.8, // 80%
    avgResponseTime: 12, // hours
    avgResolutionTime: 48, // hours
    propertyValue: 5250000, // $5.25M
    monthlyRevenue: 52500, // $52.5K
  },
  recentActivity: [
    {
      type: 'ticket_created',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      title: 'New maintenance request from Jessica Chen',
      details: 'Window in bedroom has a small crack',
      ticketId: 'demo-ticket-4'
    },
    {
      type: 'ticket_updated',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      title: 'Ticket assigned to contractor',
      details: 'Chen Plumbing & Repair assigned to sink leak issue',
      ticketId: 'demo-ticket-1'
    },
    {
      type: 'property_updated',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      title: 'Property information updated',
      details: 'Sunset Townhomes information updated',
      propertyId: 'demo-property-2'
    }
  ]
};

/**
 * Load demo data into context or state
 * @param {string} role - The user role to load data for (landlord, contractor, tenant)
 * @returns {Object} Demo data for the specified role
 */
export const loadDemoDataForRole = (role) => {
  switch(role) {
    case 'landlord':
      return {
        profile: demoLandlordProfile,
        properties: demoProperties,
        tickets: demoTickets,
        tenants: demoTenants,
        contractors: demoContractors
      };
    case 'contractor':
      // Find contractor from the list
      const contractor = demoContractors.find(c => c.id === 'demo-contractor-123');
      // Filter tickets for this contractor
      const contractorTickets = demoTickets.filter(t => 
        t.contractorId === 'demo-contractor-123' || 
        (t.status === 'ready_to_dispatch' && t.aiClassification?.suggestedContractors?.includes('demo-contractor-123'))
      );
      return {
        profile: contractor,
        tickets: contractorTickets,
        landlords: [demoLandlordProfile]
      };
    case 'tenant':
      // Find tenant from the list
      const tenant = demoTenants.find(t => t.id === 'demo-tenant-123');
      // Filter tickets for this tenant
      const tenantTickets = demoTickets.filter(t => t.tenantId === 'demo-tenant-123');
      // Find property for this tenant
      const tenantProperty = demoProperties.find(p => p.id === tenant.propertyId);
      return {
        profile: tenant,
        tickets: tenantTickets,
        property: tenantProperty
      };
    default:
      return null;
  }
};

/**
 * Generate activity feed for landlord dashboard
 * @returns {Array} Activity feed entries
 */
export const generateActivityFeed = () => {
  return [
    {
      id: 'activity-1',
      type: 'ticket_created',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      title: 'Jessica Chen submitted a maintenance request',
      details: 'Window in bedroom has a small crack in the corner',
      user: {
        id: 'demo-tenant-123',
        name: 'Jessica Chen',
        photo: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      ticketId: 'demo-ticket-4'
    },
    {
      id: 'activity-2',
      type: 'ai_classification',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
      title: 'AI classified maintenance request as HVAC issue',
      details: 'Suggested priority: Medium',
      ticketId: 'demo-ticket-3'
    },
    {
      id: 'activity-3',
      type: 'contractor_assigned',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      title: 'Chen Plumbing assigned to the sink leak ticket',
      details: 'Contractor notified via email and app',
      user: {
        id: 'demo-contractor-123',
        name: 'Chen Plumbing & Repair',
        photo: 'https://randomuser.me/api/portraits/men/29.jpg'
      },
      ticketId: 'demo-ticket-1'
    },
    {
      id: 'activity-4',
      type: 'ticket_updated',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      title: 'Chen Plumbing added progress update',
      details: 'Inspected the leak - coming from P-trap connection',
      user: {
        id: 'demo-contractor-123',
        name: 'Chen Plumbing & Repair',
        photo: 'https://randomuser.me/api/portraits/men/29.jpg'
      },
      ticketId: 'demo-ticket-1'
    },
    {
      id: 'activity-5',
      type: 'ticket_completed',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      title: 'Rodriguez Electric completed electrical repair',
      details: 'Replaced faulty GFCI outlet in kitchen',
      user: {
        id: 'demo-contractor-456',
        name: 'Rodriguez Electric',
        photo: 'https://randomuser.me/api/portraits/men/65.jpg'
      },
      ticketId: 'demo-ticket-2'
    },
    {
      id: 'activity-6',
      type: 'feedback_received',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      title: 'Michael Rodriguez provided 5-star feedback',
      details: 'Quick and professional service. Fixed the problem in one visit!',
      user: {
        id: 'demo-tenant-456',
        name: 'Michael Rodriguez',
        photo: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      ticketId: 'demo-ticket-2'
    }
  ];
};

export default {
  demoProperties,
  demoTenants,
  demoContractors,
  demoTickets,
  demoLandlordProfile,
  loadDemoDataForRole,
  generateActivityFeed
}; 