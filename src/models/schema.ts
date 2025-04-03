import { Timestamp } from 'firebase/firestore';

// User roles
export type UserRole = 'tenant' | 'landlord' | 'contractor';

/**
 * Common user interface for all user types
 */
export interface User {
  uid: string; // Firebase Auth UID
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  linkedTo: string[]; // References to propertyId or landlordId based on role
  createdAt: Timestamp;
  profileComplete: boolean;
}

/**
 * Extended interfaces for specific user roles
 */
export interface TenantUser extends User {
  role: 'tenant';
  landlordId: string; // Reference to the landlord user
  propertyId: string; // Reference to the property they're associated with
  unitNumber: string; // Their unit number within the property
}

export interface LandlordUser extends User {
  role: 'landlord';
  // Additional landlord-specific fields can be added here
}

export interface ContractorUser extends User {
  role: 'contractor';
  contractorSkills: string[]; // Array of skills/services offered
  companyId?: string; // Optional reference to a company
}

/**
 * Property interface
 */
export interface Property {
  propertyId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyName: string;
  unitList: string[]; // Array of unit numbers/identifiers
  landlordId: string; // Reference to the owner/landlord
  tenantIds: string[]; // References to tenant users
  activeRequests: string[]; // References to active maintenance tickets
  createdAt: Timestamp;
}

/**
 * Maintenance ticket interface
 */
export interface MaintenanceTicket {
  ticketId: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 1 | 2 | 3;
  category: string; // e.g., 'Plumbing', 'Electrical', 'HVAC' - classified by AI
  photoUrl?: string; // Optional reference to Firebase Storage image
  status: TicketStatus;
  submittedBy: string; // tenant's uid
  assignedTo?: string; // contractor's uid - optional as it may be null initially
  propertyId: string; // Reference to the property
  unitNumber: string; // Specific unit
  timestamps: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    classifiedAt?: Timestamp;
    assignedAt?: Timestamp;
    completedAt?: Timestamp;
  };
}

export type TicketStatus = 
  | 'new' 
  | 'pending_classification' 
  | 'ready_to_assign' 
  | 'assigned' 
  | 'in_progress' 
  | 'scheduled'
  | 'completed' 
  | 'cancelled';

/**
 * Landlord profile interface - extends information beyond the basic user
 */
export interface LandlordProfile {
  landlordId: string; // Same as user.uid
  userId: string; // Back-reference to /users/{uid}
  properties: string[]; // References to properties
  tenants: string[]; // References to tenant users
  contractors: string[]; // References to contractor users in their rolodex
  invitesSent: {
    email: string;
    status: 'pending' | 'accepted';
    propertyId?: string;
    unit?: string;
    timestamp: Timestamp;
  }[];
}

/**
 * Contractor profile interface - extends information beyond the basic user
 */
export interface ContractorProfile {
  contractorId: string; // Same as user.uid
  userId: string; // Back-reference to /users/{uid}
  skills: string[]; // Array of skills/services offered
  serviceArea: string | {
    zipCode: string;
    radiusMiles: number;
  };
  availability: boolean;
  preferredProperties?: string[]; // Optional references to properties
  rating?: number; // Average rating (0-5)
  jobsCompleted?: number; // Count of completed jobs
  companyName?: string; // Optional company name
}

/**
 * Invite interface for tracking invitations
 */
export interface Invite {
  inviteId: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired';
  landlordId?: string; // If inviting a tenant or contractor
  propertyId?: string; // If inviting a tenant
  unitNumber?: string; // If inviting a tenant
  createdAt: Timestamp;
  expiresAt: Timestamp;
} 