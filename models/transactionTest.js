import { fs } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import { collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc, arrayUnion, where, doc, getFirestore, query} from 'firebase/firestore';
import Transactions from './transactionsSchema/';
/**
 * Creates a group for a specific user in the Firestore. ➥ Returns groupId
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
 * 
 * Note: The 'Groups' constructor is used here to create an object with a predefined structure. Use import Groups from 'your/path/models/groupsSchema/';
 *
 * @return {Promise<void>} groupId if successful
 */
export const addBill = async (userId) => {
    try {
      // Reference to Firestore collection
      const billRef = collection(fs, `transactions`);
      // Create a new group instance
      let newBill = new Transactions(false, [userId], null, null, null, null, null);
      // Add a new document with an auto-generated ID
      const docRef = await addDoc(groupsRef, Object.assign({}, newGroup));
      console.log("Group created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error performing database operation:", error.message);
    }
  };