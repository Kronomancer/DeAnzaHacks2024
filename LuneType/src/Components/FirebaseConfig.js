import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "lunetype-adb4e.firebaseapp.com",
  projectId: "lunetype-adb4e",
  storageBucket: "lunetype-adb4e.firebasestorage.app",
  messagingSenderId: "346210616389",
  appId: "1:346210616389:web:e93f47fdcbacd62b830f2c",
  measurementId: "G-EF7ZCM8YJL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
