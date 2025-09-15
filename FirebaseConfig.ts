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
  apiKey: "AIzaSyAbP5yZs_HR1w5Zd1O5ptulYoGqhFNhR1Q",
  authDomain: "conexao-vital-f5704.firebaseapp.com",
  projectId: "conexao-vital-f5704",
  storageBucket: "conexao-vital-f5704.firebasestorage.app",
  messagingSenderId: "688149513652",
  appId: "1:688149513652:web:29b76b2b81b66694cb1ee1",
  measurementId: "G-W2BTB7JJGF"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);