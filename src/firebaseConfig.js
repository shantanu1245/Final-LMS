// firebase.js (updated for Firebase v9+)

// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth,createUserWithEmailAndPassword  } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA8_GQNQB1kw803JB_bvo240Oh-a6PZEsM',
  authDomain: 'final-lms-d15f0.firebaseapp.com',
  projectId: 'final-lms-d15f0',
  storageBucket: 'final-lms-d15f0.firebasestorage.app',
  messagingSenderId: '700655769720',
  appId: '1:700655769720:web:569b445a99bdf6375bb58d',
  measurementId: 'G-13D5MWJD3E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database,createUserWithEmailAndPassword };
