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
// const messaging = firebase.messaging();
// messaging.usePublicVapidKey(
//     "BN1Y76p50tWwgq45KSIFWgSOvdUCm0XF1eW6B9W17QLceZrdBBssy2PSBh074cGDjf2JKFRuq1Vr7sL4leya0EQ"
// );
// export { messaging } 
let messaging = null
if (firebase.messaging.isSupported()) {
   messaging = firebase.messaging()
   messaging.usePublicVapidKey(
       "BN1Y76p50tWwgq45KSIFWgSOvdUCm0XF1eW6B9W17QLceZrdBBssy2PSBh074cGDjf2JKFRuq1Vr7sL4leya0EQ"
   )
}
export { messaging }