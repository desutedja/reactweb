import firebase from "firebase/app";
import "firebase/storage";

// Set the configuration for your app
// TODO: Replace with your app's config object
var firebaseConfig = {
    apiKey: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8',
    storageBucket: 'clink-e9290.appspot.com',
};
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const storageRef = storage.ref();
