import firebase from "firebase/app";
import "firebase/storage";
import "firebase/messaging";

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

// storage
export const storage = firebase.storage();
export const storageRef = storage.ref();

// cloud messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BN1Y76p50tWwgq45KSIFWgSOvdUCm0XF1eW6B9W17QLceZrdBBssy2PSBh074cGDjf2JKFRuq1Vr7sL4leya0EQ");

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
    if (currentToken) {
        console.log('Current token: ', currentToken);

        // sendTokenToServer(currentToken);
        // updateUIForPushEnabled(currentToken);
    } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    // setTokenSentToServer(false);
});

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        console.log('Current token: ', refreshedToken);

        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false);
        // Send Instance ID token to app server.
        // sendTokenToServer(refreshedToken);
        // ...
    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        // showToken('Unable to retrieve refreshed token ', err);
    });
});

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    alert('Message received. ' + payload);
    // ...
});