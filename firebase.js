// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbUpVvgXUF_-Y2cgs8YuKY5QVEP9apntI",
  authDomain: "smartchatapp-8a0b9.firebaseapp.com",
  projectId: "smartchatapp-8a0b9",
  storageBucket: "smartchatapp-8a0b9.appspot.com",
  messagingSenderId: "1069569988553",
  appId: "1:1069569988553:web:ed27462ba6d8527dcc3a18",
  measurementId: "G-SRC407E9SD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
