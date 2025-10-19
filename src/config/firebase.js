// Import the functions you need from the SDKs you need

// Initialize Firebase and configure the firebase.

// Import the functions you need from the SDKs you need

// Initialize Firebase and configure the firebase.

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHo3xrTwggcOANhEk4ffG0v5P51dV61wE",
  authDomain: "busybuy-fe33d.firebaseapp.com",
  projectId: "busybuy-fe33d",
  // storageBucket usually ends with appspot.com for Firebase projects
  storageBucket: "busybuy-fe33d.appspot.com",
  messagingSenderId: "39212170055",
  appId: "1:39212170055:web:43ef589c84874fa2f6ea62",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
