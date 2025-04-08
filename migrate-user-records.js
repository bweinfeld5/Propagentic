// Script to migrate existing user records
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyA1j5o9uI3NFeufUuJOKR3-TQzQk-mh8JE",
  authDomain: "propagentic.firebaseapp.com",
  projectId: "propagentic",
  storageBucket: "propagentic.appspot.com",
  messagingSenderId: "859812091492",
  appId: "1:859812091492:web:8e9e6c8fbfecbc8fa8f1e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateUserRecords() {
  console.log('Starting user record migration...');
  
  try {
    const usersRef = collection(db, 'users');
    const userDocs = await getDocs(usersRef);
    
    console.log(`Found ${userDocs.size} user records.`);
    
    let updatedCount = 0;
    
    for (const docSnapshot of userDocs.docs) {
      const userData = docSnapshot.data();
      const updates = {};
      let needsUpdate = false;
      
      // If userType exists but role doesn't, set role = userType
      if (userData.userType && !userData.role) {
        updates.role = userData.userType;
        needsUpdate = true;
        console.log(`User ${userData.email}: Adding role=${userData.userType}`);
      }
      
      // If role exists but userType doesn't, set userType = role
      if (userData.role && !userData.userType) {
        updates.userType = userData.role;
        needsUpdate = true;
        console.log(`User ${userData.email}: Adding userType=${userData.role}`);
      }
      
      // If onboardingComplete is missing
      if (userData.onboardingComplete === undefined) {
        // Assume onboarding is complete for existing users
        updates.onboardingComplete = true;
        needsUpdate = true;
        console.log(`User ${userData.email}: Setting onboardingComplete=true`);
      }
      
      if (needsUpdate) {
        const userRef = doc(db, 'users', docSnapshot.id);
        await updateDoc(userRef, updates);
        updatedCount++;
        console.log(`Updated user record for ${userData.email}`);
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} user records.`);
    
  } catch (error) {
    console.error('Error migrating user records:', error);
  }
}

migrateUserRecords().then(() => console.log('Done!')); 