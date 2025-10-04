import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBNum5z4C5uFUV0WPAadPPkb_dJaFvtTY8",
  authDomain: "task-management-board-2e92d.firebaseapp.com",
  projectId: "task-management-board-2e92d",
  storageBucket: "task-management-board-2e92d.firebasestorage.app",
  messagingSenderId: "579349923181",
  appId: "1:579349923181:web:94cd33cf1c5b4f2126c664",
  measurementId: "G-YTFQN2WE3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;
