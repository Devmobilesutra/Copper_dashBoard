import firebase from '@firebase/app';
import 'firebase/firestore';
import '@firebase/storage';
// import { FirestoreProvider } from 'react-firestore';

// require('firebase/auth')
 
// import firebase from 'firebase/app' 
// import 'firebase/firebase'
 
var firebaseConfig = {
    apiKey: "AIzaSyCJhp_0EQxTZcPy8cneVwGienQSjiHGP3M",
    authDomain: "copper-fe617.firebaseapp.com",
    projectId: "copper-fe617",
    storageBucket: "copper-fe617.appspot.com",
    messagingSenderId: "256794258770",
    appId: "1:256794258770:web:2623c5a37d6962acf25e8b"
};

const fire = firebase.initializeApp(firebaseConfig);

// console.log("auth: ", firebase.auth(fire));

export default fire;