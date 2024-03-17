import { getDatabase } from "firebase/database";
import firebase from 'firebase/compat/app'

const firebaseConfig = {
    apiKey: "AIzaSyDx1aGjvEf8DmUup6ywymPZycLPVanhMNY",
    authDomain: "trevelclever.firebaseapp.com",
    databaseURL: "https://trevelclever-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "trevelclever",
    storageBucket: "trevelclever.appspot.com",
    messagingSenderId: "137443692664",
    appId: "1:137443692664:web:dc06f6c8da479043e21d8d"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
// init Database
export const db = getDatabase();