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
 * Adds a new bill to the transactions collection.
 * 
 * Before adding to Firestore, this function converts the `tAccount` property from a Map
 * to an object;
 * 
 * @param {Object} newBill - The Transactions1 instance.
 *   Expected to have a `tAccount` property which is a Map of user IDs to their respective debt,
 *   which will be converted to an object before storing in the database.
 * @returns {Promise<string|undefined>} A promise that resolves to the new document ID if successful,
 *   or `undefined` if the operation fails.
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

