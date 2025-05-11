// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAEkiqStj8UEZDYe1oTZrgEM0yN74G1HcE",
    authDomain: "visitor-garden.firebaseapp.com",
    projectId: "visitor-garden",
    storageBucket: "visitor-garden.firebasestorage.app",
    messagingSenderId: "42053246247",
    appId: "1:42053246247:web:14d96351737a9d28075d02",
    measurementId: "G-XVZM5VFH6V"
  };
  
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
