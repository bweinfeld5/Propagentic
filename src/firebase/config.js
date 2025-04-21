// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence 
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from "./firebaseConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase - This ensures firebase.initializeApp() is only called once
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log("Firebase app already exists, retrieving existing instance");
    app = initializeApp(firebaseConfig, "secondary");
  } else {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Enable Firestore offline persistence
const enableOfflineSupport = async () => {
  try {
    // Enable multi-tab persistence if possible, fall back to single-tab if not
    const persistenceSettings = { cacheSizeBytes: CACHE_SIZE_UNLIMITED };
    
    try {
      // Multi-tab persistence is preferred but not supported in all browsers
      await enableMultiTabIndexedDbPersistence(db, persistenceSettings);
      console.log("Multi-tab offline persistence enabled");
    } catch (multiTabError) {
      // Fall back to single-tab persistence if multi-tab not supported
      if (multiTabError.code === 'failed-precondition') {
        // Multiple tabs open, use enableIndexedDbPersistence instead
        await enableIndexedDbPersistence(db, persistenceSettings);
        console.log("Single-tab offline persistence enabled");
      } else if (multiTabError.code === 'unimplemented') {
        // IndexedDB not supported by browser, local data will be lost on refresh
        console.warn("Offline persistence is not supported by this browser");
      } else {
        console.error("Unexpected error enabling offline persistence:", multiTabError);
      }
    }
  } catch (error) {
    console.error("Error setting up offline persistence:", error);
    console.warn("Application will continue but offline support is limited");
  }
};

// Initialize offline support
enableOfflineSupport();

// DEBUG: Monitor auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('[DEBUG] Auth state changed: User signed in', user.uid);
  } else {
    console.log('[DEBUG] Auth state changed: User signed out');
  }
});

// Initialize Analytics conditionally (it may not be available in all environments)
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(e => console.error("Analytics error:", e));

// Use emulators for local development
if (process.env.NODE_ENV === 'development') {
  try {
    // Uncomment these lines to use Firebase emulators
    // connectFunctionsEmulator(functions, "localhost", 5001);
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, "http://localhost:9099");
    // connectStorageEmulator(storage, "localhost", 9199);
    console.log("[DEBUG] Firebase emulator connections configured");
  } catch (error) {
    console.error("[DEBUG] Error connecting to Firebase emulators:", error);
  }
}

// Export all Firebase services
export { app, auth, db, storage, functions, analytics };

// Helper for using callable functions
export const callFunction = async (name, data) => {
  const { httpsCallable } = await import('firebase/functions');
  const func = httpsCallable(functions, name);
  try {
    const result = await func(data);
    return result.data;
  } catch (error) {
    console.error(`Error calling function ${name}:`, error);
    throw error;
  }
};

export default app; 