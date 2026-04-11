import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQ2_xa2Nw2vB1GivwWxWaKijpDaWpHMLw",
  authDomain: "pj-yotsuba-corporate.firebaseapp.com",
  projectId: "pj-yotsuba-corporate",
  storageBucket: "pj-yotsuba-corporate.firebasestorage.app",
  messagingSenderId: "30131850297",
  appId: "1:30131850297:web:72f66776d0789b960c51e8",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
