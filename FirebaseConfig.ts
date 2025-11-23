// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGpJ1nhMtkspMbu2_9vE7fWp-oYgrQtPk",
  authDomain: "conexao-vital-79225.firebaseapp.com",
  projectId: "conexao-vital-79225",
  storageBucket: "conexao-vital-79225.firebasestorage.app",
  messagingSenderId: "219189836911",
  appId: "1:219189836911:web:573cc07528666e13f9e19a",
  measurementId: "G-W2BTB7JJGF"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);