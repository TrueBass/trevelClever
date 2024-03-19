import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDx1aGjvEf8DmUup6ywymPZycLPVanhMNY",
    authDomain: "trevelclever.firebaseapp.com",
    databaseURL: "https://trevelclever-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "trevelclever",
    storageBucket: "trevelclever.appspot.com",
    messagingSenderId: "137443692664",
    appId: "1:137443692664:web:dc06f6c8da479043e21d8d"
  };

// if(!firebase.apps.length){
//     firebase.initializeApp(firebaseConfig);
// }

// init Database
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// export const auth = getAuth(app);
// export const db = getDatabase();