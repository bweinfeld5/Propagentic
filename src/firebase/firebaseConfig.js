// Firebase configuration 
// This file should be excluded from version control in a production environment
// Use environment variables in production

/**
 * Firebase configuration object
 * In a production environment, you should use environment variables:
 * 
 * const firebaseConfig = {
 *   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
 *   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
 *   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
 *   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
 *   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
 *   appId: process.env.REACT_APP_FIREBASE_APP_ID,
 *   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
 * };
 */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcsJWLoVoC_kPORoVJA_-mG3LIWfbU-rw",
  authDomain: "propagentic.firebaseapp.com",
  databaseURL: "https://propagentic-default-rtdb.firebaseio.com",
  projectId: "propagentic",
  storageBucket: "propagentic.firebasestorage.app",
  messagingSenderId: "121286300748",
  appId: "1:121286300748:web:0c69ea6ff643c8f75110e9",
  measurementId: "G-7DTWZQH28H"
};

export default firebaseConfig; 