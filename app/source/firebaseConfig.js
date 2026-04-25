import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3KbUHTx32Hl2g6jT1ck3cXgv-g-vphnI",
  authDomain: "badmintoncourts-28a16.firebaseapp.com",
  projectId: "badmintoncourts-28a16",
  storageBucket: "badmintoncourts-28a16.firebasestorage.app",
  messagingSenderId: "495544587158",
  appId: "1:495544587158:web:51b1fc889b9d7c5b1103b7",
  measurementId: "G-XTYYN2J6QH"
};

// Initialize Firebase - check if app is already initialized to avoid duplicates
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export initialized services and Firestore functions
export { 
  app, 
  db, 
  auth, 
  storage,
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc
};