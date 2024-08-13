import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIid0A8LGaSA-1UWKtD6qVjmmUXH3EXoU",
  authDomain: "calendarapp-2bdf7.firebaseapp.com",
  projectId: "calendarapp-2bdf7",
  storageBucket: "calendarapp-2bdf7.appspot.com",
  messagingSenderId: "1031698987773",
  appId: "1:1031698987773:web:0974af79f5da104c6f9c94",
};

const app = initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);

export default db;
