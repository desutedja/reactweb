/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: "AIzaSyAVj5THZKxYGzI8t9B2r-gEqRyyGKn82Kk",
  authDomain: "centratama-group-bm.firebaseapp.com",
  databaseURL: "https://centratama-group-bm.firebaseio.com",
  projectId: "centratama-group-bm",
  storageBucket: "centratama-group-bm.appspot.com",
  messagingSenderId: "953791710611",
  appId: "1:953791710611:web:13de4c4f06af196bd65466",
  measurementId: "G-M082DYCMHC"
};
firebase.initializeApp(firebaseConfig);

// cloud messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
    "BN1Y76p50tWwgq45KSIFWgSOvdUCm0XF1eW6B9W17QLceZrdBBssy2PSBh074cGDjf2JKFRuq1Vr7sL4leya0EQ"
);

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    // eslint-disable-next-line no-restricted-globals
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});