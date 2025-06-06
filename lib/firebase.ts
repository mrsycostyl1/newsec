import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1Y3v-ui6PtDh94zGpO3EmcciJPRITPro",
  authDomain: "my-air-899a7.firebaseapp.com",
  databaseURL: "https://my-air-899a7-default-rtdb.firebaseio.com",
  projectId: "my-air-899a7",
  storageBucket: "my-air-899a7.appspot.com",
  messagingSenderId: "739001861292",
  appId: "1:739001861292:web:0b885a5269b67eb1f88b09"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
