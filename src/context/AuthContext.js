import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create Auth context
const AuthContext = createContext();

// Auth context provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user with user type
  const register = async (email, password, userType) => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      userType,
      createdAt: serverTimestamp(),
      uid: user.uid
    });
    
    return userCredential;
  };

  // Login an existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout the current user
  const logout = () => {
    localStorage.removeItem('user');
    setUserProfile(null);
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Fetch user profile data from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      console.log('Fetching user profile for uid:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        console.log('User profile found:', profileData);
        
        // Update the user profile state
        setUserProfile(profileData);
        
        // Also update localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: uid,
          email: profileData.email,
          displayName: profileData.name,
          userType: profileData.userType,
          onboardingComplete: profileData.onboardingComplete
        }));
        
        return profileData;
      }
      console.log('No user profile document found for uid:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Helper functions to check user type
  const isLandlord = () => {
    return userProfile?.userType === 'landlord';
  };

  const isTenant = () => {
    return userProfile?.userType === 'tenant';
  };

  const isContractor = () => {
    return userProfile?.userType === 'contractor';
  };

  // Set up an auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get additional user data from Firestore
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
        
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          userType: profile?.userType,
          onboardingComplete: profile?.onboardingComplete
        }));
        
        console.log('Auth state changed, user logged in with profile:', profile);
      } else {
        setUserProfile(null);
        localStorage.removeItem('user');
        console.log('Auth state changed, user logged out');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    fetchUserProfile,
    isLandlord,
    isTenant,
    isContractor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 