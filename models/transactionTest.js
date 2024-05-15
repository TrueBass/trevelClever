import { fs } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import { collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc, arrayUnion, where, doc, getFirestore, query, Timestamp} from 'firebase/firestore';
import Transactions from './transactionsSchema/';

export function getLocalTime(){
  const localDate = new Date(); // Gets the local current time
  const localTimestamp = Timestamp.fromDate(localDate);
  return localTimestamp;
}
/**
 * Creates a group for a specific user in the Firestore. ➥ Returns groupId
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
 * 
 * Note: The 'Groups' constructor is used here to create an object with a predefined structure. Use import Groups from 'your/path/models/groupsSchema/';
 *
 * @return {Promise<void>} groupId if successful
 */
export const addBill = async (newBill) => {
    try {
      // Reference to Firestore collection
      const billRef = collection(fs, `transactions`);
      if (newBill.tAccount instanceof Map) {
        newBill.tAccount = Object.fromEntries(newBill.tAccount);
      }
      const docRef = await addDoc(billRef, Object.assign({}, newBill));
      console.log("Trans created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error performing database operation:", error.message);
    }
  };

