// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ04svVxdvDcnC7ozBmWu-Ggc2EOsVBLY",
  authDomain: "expense-tracker-7fda1.firebaseapp.com",
  projectId: "expense-tracker-7fda1",
  storageBucket: "expense-tracker-7fda1.appspot.com",
  messagingSenderId: "1033310260483",
  appId: "1:1033310260483:web:ca6f683871dd3c8d696d36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
