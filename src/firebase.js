import firebase from "firebase/app";
import "firebase/storage";
import "firebase/messaging";

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
    apiKey: "AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8",
    authDomain: "clink-e9290.firebaseapp.com",
    databaseURL: "https://clink-e9290.firebaseio.com",
    projectId: "clink-e9290",
    storageBucket: "clink-e9290.appspot.com",
    messagingSenderId: "10663666241",
    appId: "1:10663666241:web:f3a844afac4e2025a6dcc0",
    measurementId: "G-78NJPGG8W4"
};
firebase.initializeApp(firebaseConfig);

// storage
export const storage = firebase.storage();
export const storageRef = storage.ref();

// cloud messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
    "BBYd0Bmgda_E_LK9o6QGDUWMeu7ixgUfTGo1TQ9_CwwxiqZng9kwK6sjqOs5znq5QMQHDW8DITGSpDCzp_1CuEU"
);
export { messaging } 