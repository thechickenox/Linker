// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getPerformance } from 'firebase/performance'
import React from 'react';
import "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2jKZrzOLo4sbDZ03gIbNXXh54NP-EiFM",
  authDomain: "linker-63fb9.firebaseapp.com",
  projectId: "linker-63fb9",
  storageBucket: "linker-63fb9.firebasestorage.app",
  messagingSenderId: "824172926019",
  appId: "1:824172926019:web:9dd709154be18d671d70f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Solo accede a `getPerformance` en el cliente
let performanceObject: any;
if (typeof window !== 'undefined') {
  performanceObject = getPerformance(app);
}

export default performanceObject;
