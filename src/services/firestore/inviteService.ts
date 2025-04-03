import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Invite, UserRole } from '../../models/schema';
import { inviteConverter, createNewInvite } from '../../models/converters';

// Collection references
const invitesCollection = collection(db, 'invites').withConverter(inviteConverter);

/**
 * Get an invite by ID
 */
export async function getInviteById(inviteId: string): Promise<Invite | null> {
  const inviteDoc = doc(db, 'invites', inviteId).withConverter(inviteConverter);
  const inviteSnapshot = await getDoc(inviteDoc);
  
  if (inviteSnapshot.exists()) {
    return inviteSnapshot.data();
  }
  
  return null;
}

/**
 * Get all invites sent by a landlord
 */
export async function getLandlordInvites(landlordId: string): Promise<Invite[]> {
  const q = query(invitesCollection, where('landlordId', '==', landlordId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Get invite by email
 */
export async function getInviteByEmail(email: string): Promise<Invite | null> {
  const q = query(invitesCollection, where('email', '==', email), where('status', '==', 'pending'));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  
  return null;
}

/**
 * Create a new tenant invite
 */
export async function createTenantInvite(
  email: string,
  landlordId: string,
  propertyId: string,
  unitNumber: string
): Promise<Invite> {
  // Check if an invite already exists for this email
  const existingInvite = await getInviteByEmail(email);
  
  if (existingInvite) {
    // Update the existing invite if it's for the same landlord
    if (existingInvite.landlordId === landlordId) {
      await updateInvite(existingInvite.inviteId, {
        propertyId,
        unitNumber,
        status: 'pending',
        expiresAt: new Timestamp(
          Timestamp.now().seconds + 7 * 24 * 60 * 60,
          Timestamp.now().nanoseconds
        )
      });
      
      return {
        ...existingInvite,
        propertyId,
        unitNumber,
        status: 'pending',
        expiresAt: new Timestamp(
          Timestamp.now().seconds + 7 * 24 * 60 * 60,
          Timestamp.now().nanoseconds
        )
      };
    }
  }
  
  // Create a new invite
  const inviteRef = doc(collection(db, 'invites'));
  const inviteId = inviteRef.id;
  
  const inviteData = createNewInvite(
    inviteId,
    email,
    'tenant',
    landlordId,
    propertyId,
    unitNumber
  );
  
  await setDoc(inviteRef, inviteData);
  
  // Add the invite to the landlord's profile
  const landlordProfileRef = doc(db, 'landlordProfiles', landlordId);
  const landlordProfileSnapshot = await getDoc(landlordProfileRef);
  
  if (landlordProfileSnapshot.exists()) {
    const invitesSent = landlordProfileSnapshot.data().invitesSent || [];
    await updateDoc(landlordProfileRef, {
      invitesSent: [
        ...invitesSent,
        {
          email,
          status: 'pending',
          propertyId,
          unit: unitNumber,
          timestamp: Timestamp.now()
        }
      ]
    });
  }
  
  return inviteData;
}

/**
 * Create a new contractor invite
 */
export async function createContractorInvite(
  email: string,
  landlordId: string
): Promise<Invite> {
  // Check if an invite already exists for this email
  const existingInvite = await getInviteByEmail(email);
  
  if (existingInvite) {
    // Update the existing invite if it's for the same landlord
    if (existingInvite.landlordId === landlordId) {
      await updateInvite(existingInvite.inviteId, {
        status: 'pending',
        expiresAt: new Timestamp(
          Timestamp.now().seconds + 7 * 24 * 60 * 60,
          Timestamp.now().nanoseconds
        )
      });
      
      return {
        ...existingInvite,
        status: 'pending',
        expiresAt: new Timestamp(
          Timestamp.now().seconds + 7 * 24 * 60 * 60,
          Timestamp.now().nanoseconds
        )
      };
    }
  }
  
  // Create a new invite
  const inviteRef = doc(collection(db, 'invites'));
  const inviteId = inviteRef.id;
  
  const inviteData = createNewInvite(
    inviteId,
    email,
    'contractor',
    landlordId
  );
  
  await setDoc(inviteRef, inviteData);
  
  // Add the invite to the landlord's profile
  const landlordProfileRef = doc(db, 'landlordProfiles', landlordId);
  const landlordProfileSnapshot = await getDoc(landlordProfileRef);
  
  if (landlordProfileSnapshot.exists()) {
    const invitesSent = landlordProfileSnapshot.data().invitesSent || [];
    await updateDoc(landlordProfileRef, {
      invitesSent: [
        ...invitesSent,
        {
          email,
          status: 'pending',
          timestamp: Timestamp.now()
        }
      ]
    });
  }
  
  return inviteData;
}

/**
 * Update an invite
 */
export async function updateInvite(
  inviteId: string,
  updateData: Partial<Invite>
): Promise<void> {
  const inviteRef = doc(db, 'invites', inviteId);
  await updateDoc(inviteRef, updateData);
}

/**
 * Mark an invite as accepted
 */
export async function acceptInvite(inviteId: string, userId: string): Promise<void> {
  const inviteRef = doc(db, 'invites', inviteId);
  const inviteSnapshot = await getDoc(inviteRef);
  
  if (inviteSnapshot.exists()) {
    const invite = inviteSnapshot.data();
    
    // Update the invite
    await updateDoc(inviteRef, {
      status: 'accepted'
    });
    
    // Also update the landlord's profile
    if (invite.landlordId) {
      const landlordProfileRef = doc(db, 'landlordProfiles', invite.landlordId);
      const landlordProfileSnapshot = await getDoc(landlordProfileRef);
      
      if (landlordProfileSnapshot.exists()) {
        const invitesSent = landlordProfileSnapshot.data().invitesSent || [];
        const updatedInvites = invitesSent.map((sentInvite: any) => {
          if (sentInvite.email === invite.email) {
            return {
              ...sentInvite,
              status: 'accepted'
            };
          }
          return sentInvite;
        });
        
        await updateDoc(landlordProfileRef, {
          invitesSent: updatedInvites
        });
        
        // If this is a tenant invite, also update the tenants array
        if (invite.role === 'tenant') {
          const tenants = landlordProfileSnapshot.data().tenants || [];
          
          if (!tenants.includes(userId)) {
            await updateDoc(landlordProfileRef, {
              tenants: [...tenants, userId]
            });
          }
        }
        
        // If this is a contractor invite, also update the contractors array
        if (invite.role === 'contractor') {
          const contractors = landlordProfileSnapshot.data().contractors || [];
          
          if (!contractors.includes(userId)) {
            await updateDoc(landlordProfileRef, {
              contractors: [...contractors, userId]
            });
          }
        }
      }
    }
  }
}

/**
 * Delete an invite
 */
export async function deleteInvite(inviteId: string): Promise<void> {
  const inviteRef = doc(db, 'invites', inviteId);
  const inviteSnapshot = await getDoc(inviteRef);
  
  if (inviteSnapshot.exists()) {
    const invite = inviteSnapshot.data();
    
    // Delete the invite
    await deleteDoc(inviteRef);
    
    // Also update the landlord's profile
    if (invite.landlordId) {
      const landlordProfileRef = doc(db, 'landlordProfiles', invite.landlordId);
      const landlordProfileSnapshot = await getDoc(landlordProfileRef);
      
      if (landlordProfileSnapshot.exists()) {
        const invitesSent = landlordProfileSnapshot.data().invitesSent || [];
        const updatedInvites = invitesSent.filter(
          (sentInvite: any) => sentInvite.email !== invite.email
        );
        
        await updateDoc(landlordProfileRef, {
          invitesSent: updatedInvites
        });
      }
    }
  }
} 