import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxcz5_-N_-Cpm09gqmN8Ezu_d8AQsmGRU",
  authDomain: "se3316-lab4-cd7d5.firebaseapp.com",
  projectId: "se3316-lab4-cd7d5",
  storageBucket: "se3316-lab4-cd7d5.appspot.com",
  messagingSenderId: "689631822144",
  appId: "1:689631822144:web:179f0fd0326104e5f7baa5",
  measurementId: "G-JKK5V2JVLE",
};

const app = initializeApp(firebaseConfig);

//the app will have authentication
export const auth = getAuth(app);
