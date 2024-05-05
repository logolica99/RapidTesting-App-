// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6DyessAWqV0hO2KKbDKr8zPJWmWexINI",
  authDomain: "rapidtesting-5afc5.firebaseapp.com",
  projectId: "rapidtesting-5afc5",
  storageBucket: "rapidtesting-5afc5.appspot.com",
  messagingSenderId: "419365379387",
  appId: "1:419365379387:web:aa2d6f05f57e4853852b1e",
  measurementId: "G-J32QM087BC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
