// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; 
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD1dqr5u7BZXevhHqAIod1CJULkk0fz1hg",
//   authDomain: "pantrymanagement-b07e7.firebaseapp.com",
//   projectId: "pantrymanagement-b07e7",
//   storageBucket: "pantrymanagement-b07e7.appspot.com",
//   messagingSenderId: "489307278042",
//   appId: "1:489307278042:web:45daafd170b67fbab233e3",
//   measurementId: "G-FSF5H4851M"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);
// export { firestore , storage};


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1dqr5u7BZXevhHqAIod1CJULkk0fz1hg",
  authDomain: "pantrymanagement-b07e7.firebaseapp.com",
  projectId: "pantrymanagement-b07e7",
  storageBucket: "pantrymanagement-b07e7.appspot.com",
  messagingSenderId: "489307278042",
  appId: "1:489307278042:web:45daafd170b67fbab233e3",
  measurementId: "G-FSF5H4851M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { firestore, analytics };
