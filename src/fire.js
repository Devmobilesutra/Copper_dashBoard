import firebase from '@firebase/app';
import 'firebase/firestore';
import '@firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCJhp_0EQxTZcPy8cneVwGienQSjiHGP3M",
    authDomain: "copper-fe617.firebaseapp.com",
    projectId: "copper-fe617",
    storageBucket: "copper-fe617.appspot.com",
    messagingSenderId: "256794258770",
    appId: "1:256794258770:web:2623c5a37d6962acf25e8b"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;