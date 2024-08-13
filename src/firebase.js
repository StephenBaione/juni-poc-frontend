// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrNp8VEKxVJHMdko0qeaI6X08N2RiGDTw",
  authDomain: "personamatic.firebaseapp.com",
  projectId: "personamatic",
  storageBucket: "personamatic.appspot.com",
  messagingSenderId: "135016777798",
  appId: "1:135016777798:web:2a3950f2e25ef3141f6247",
  measurementId: "G-E5VYXTGPKF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
