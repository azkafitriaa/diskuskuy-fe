// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4qgherZnCahPmekM7wV8PVD6B-KS8uoQ",
  authDomain: "diskuskuy-refinement.firebaseapp.com",
  projectId: "diskuskuy-refinement",
  storageBucket: "diskuskuy-refinement.appspot.com",
  messagingSenderId: "640555013695",
  appId: "1:640555013695:web:54373a534d94e30c800a8a",
  measurementId: "G-794FBHTD11"
};

// Initialize Firebase
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();