/**
 * Firebase SDK Initialization
 *
 * Initializes Firebase client SDK for authentication, Firestore, and Cloud Functions
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'babili-isse.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'babili-isse',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'babili-isse.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to emulators in development (optional)
if (process.env.REACT_APP_USE_EMULATORS === 'true') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
  console.log('Connected to Firebase Functions emulator');
}

export default app;
