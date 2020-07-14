import firebase from "firebase/app";
import "firebase/storage";

// Set the configuration for your app
// TODO: Replace with your app's config object
var firebaseConfig = {
    apiKey: 'AIzaSyBw115oaVaGghAnkJA3kHchRpETcuL5BF0',
    storageBucket: 'centratama-group-bm.appspot.com',
};
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const storageRef = storage.ref();
