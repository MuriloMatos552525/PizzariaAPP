// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADEMBW55rB6H9TDXpQsNvAv4GZyWfbPc0",
  authDomain: "bellaitalia-5b526.firebaseapp.com",
  projectId: "bellaitalia-5b526",
  storageBucket: "bellaitalia-5b526.appspot.com",
  messagingSenderId: "955055294238",
  appId: "1:955055294238:web:f12a9696e6fd7469106b0f",
  measurementId: "G-W2NQF7PL6S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
