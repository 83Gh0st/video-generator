// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage }  from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "autocreate-7f6f8.firebaseapp.com",
  projectId: "autocreate-7f6f8",
  storageBucket: "autocreate-7f6f8.firebasestorage.app",
  messagingSenderId: "304961920689",
  appId: "1:304961920689:web:6890ef864de6dd52bc8c90",
  measurementId: "G-CJ1F8HTB7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);