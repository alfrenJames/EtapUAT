import { initializeApp, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDnnpKATQ8A4VW8hw3cYtuQgP3_bAcNIEU",
    authDomain: "prototype-control-on-ofd.firebaseapp.com",
    projectId: "prototype-control-on-ofd",
    storageBucket: "prototype-control-on-ofd.appspot.com",
    messagingSenderId: "294472890765",
    appId: "1:294472890765:web:935c6d71c68ffa738ee5c4",
    measurementId: "G-KCN6QT8TF9"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!initializeApp.length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // Get the already initialized app
}

const database = getDatabase(app);

export { app, database }; 