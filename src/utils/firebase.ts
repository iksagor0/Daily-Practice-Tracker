import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyABBiZ665TxQktlPynC9DAZtB8d0U_QJ8w",
  authDomain: "daily-practice-tracker.firebaseapp.com",
  databaseURL: "https://daily-practice-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daily-practice-tracker",
  storageBucket: "daily-practice-tracker.firebasestorage.app",
  messagingSenderId: "149600530913",
  appId: "1:149600530913:web:b7478144c0fc051fb8a2a0",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
