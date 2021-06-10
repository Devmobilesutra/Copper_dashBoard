// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCJhp_0EQxTZcPy8cneVwGienQSjiHGP3M",
    authDomain: "copper-fe617.firebaseapp.com",
    databaseURL: 'https://copper-fe617.firebaseio.com',
    projectId: "copper-fe617",
    storageBucket: "copper-fe617.appspot.com",
    messagingSenderId: "256794258770",
    appId: "1:256794258770:web:2623c5a37d6962acf25e8b",
    measurementId: "G-3CS9B7YCDP"
});
// firebase.analytics();

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
    const notificationTitle = 'onMessage';
    const notificationOptions = {
        body: 'onMessage Message body.',
        // icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        // icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});