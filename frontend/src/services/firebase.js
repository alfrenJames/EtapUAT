import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDnnpKATQ8A4VW8hw3cYtuQgP3_bAcNIEU",
    authDomain: "prototype-control-on-ofd.firebaseapp.com",
    databaseURL: "https://prototype-control-on-ofd-default-rtdb.firebaseio.com",
    projectId: "prototype-control-on-ofd",
    storageBucket: "prototype-control-on-ofd.appspot.com",
    messagingSenderId: "294472890765",
    appId: "1:294472890765:web:935c6d71c68ffa738ee5c4",
    measurementId: "G-KCN6QT8TF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database };