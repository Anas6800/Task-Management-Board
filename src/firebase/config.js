// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwqZGdUSnTGOIMrgoya5fdbD3y5SkbmqQ",
  authDomain: "tasks-management-board-fc46d.firebaseapp.com",
  projectId: "tasks-management-board-fc46d",
  storageBucket: "tasks-management-board-fc46d.firebasestorage.app",
  messagingSenderId: "506833398657",
  appId: "1:506833398657:web:8a3355069cbb6b32fe5680",
  measurementId: "G-0SJY4KTWF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };