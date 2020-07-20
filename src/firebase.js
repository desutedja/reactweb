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
messaging.usePublicVapidKey("BCwXtbSgh9u875sQyD-_IKYttX8iCQLi_FICbJNgIdAE8P5F6gZJBzHzdIZR3Y_3kbmjn9kTHPaAu5BG9WB95qc");

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
    if (currentToken) {
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