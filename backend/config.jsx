import {initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, update, equalTo, get } from "@firebase/database";
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

// firebase
// init app
export const app = initializeApp(firebaseConfig);
// init realtime db
// export const db = getDatabase(app, firebaseConfig.databaseURL);
// init auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// auth and db variables need to put user's values
// to the Realtime db and Authentication
export const db = getDatabase();
export const fs = getFirestore();
// export const db = firebaseConfig.database();