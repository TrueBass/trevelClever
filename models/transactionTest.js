import { fs } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import { collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc, arrayUnion, where, doc, getFirestore, deleteField, Timestamp} from 'firebase/firestore';
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
/**
 * Asynchronously deletes 🗑️ a bill from the Firestore collection by its document ID.* 
 * @param {string} transactionId - The ID of the document representing the bill to be deleted.
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete,
 *   or rejects with an error if the operation fails.
 */
export const deleteBill = async (transactionId) => {
  try {
    // Reference to Firestore collection
    const billRef = doc(fs, `transactions/${transactionId}`);
    await deleteDoc(billRef);
    console.log("Transaction deleted with ID:", transactionId);
  } catch (error) {
    console.error("Error performing database operation:", error.message);
  }
};


/**
 * Asynchronously updates the total payment amount of a transaction. Remember to split money again!
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be updated.
 * @param {number} newAmount - The new total amount of the transaction.
 * @returns {Promise<void>}
 */
export async function updateTotalAmount(transactionId, newAmount) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  await updateDoc(transactionRef, { "tPayment.0": newAmount });
}
/**
 * Asynchronously adds a new member to the transaction's account map. Remember to split money again!
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be updated.
 * @param {string} memberId - The ID of the new member to be added with initial null value.
 * @returns {Promise<void>}
 */
export async function addMemberToAccount(transactionId, memberId) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  await updateDoc(transactionRef, { [`tAccount.${memberId}`]: null });
}

/**
 * Asynchronously deletes a member from the transaction's account. Remember to split money again!
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be updated.
 * @param {string} memberId - The ID of the member to be removed.
 * @returns {Promise<void>}
 */
export async function deleteMemberFromAccount(transactionId, memberId) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  // Use FieldValue.delete() from 'firebase/firestore' for deleting fields from documents.
  await updateDoc(transactionRef, { [`tAccount.${memberId}`]: deleteField() });
}
/**
 * Asynchronously changes the split type 
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be updated.
 * @param {number} newSplitType - The new split type (e.g., 0 for equal, 1 for custom).
 * @returns {Promise<void>}
 */
export async function changeSplitType(transactionId, newSplitType) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  await updateDoc(transactionRef, { tSplitType: newSplitType });
}
/**
 * Asynchronously splits the total amount between members. Use it  after updating Members 👨‍❤️‍💋‍👨/ Total💰 of the bill
 * 
 * This function should be called after modifying the transaction amount or members,
 * or after changing the split type, to recalculate each member's share.
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be updated.
 * @returns {Promise<void>}
 */
export async function splitTotalBetweenMembers(transactionId) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  const transaction = await getDoc(transactionRef); // Retrieves the current transaction data

  if (transaction.exists()) {
    const bill = transaction.data();
    console.log(bill);
    if (bill.tSplitType === 0) {
      const divider = Object.keys(bill.tAccount).length;
      const debt = bill.tPayment[0] / divider;
      // Update all members' debts to be equal.
      const updates = {};
      for (let memberId in bill.tAccount) {
        updates[`tAccount.${memberId}`] = debt;
      }
      await updateDoc(transactionRef, updates);
    } else if (bill.tSplitType === 1) {
      let difference = bill.tPayment[0]; // To keep track of the sum of numbers
      let nullCount = 0; // To count how many keys have null values
      for (let key in bill.tAccount) {
        if (bill.tAccount[key] !== null) {
          difference-=bill.tAccount[key] ;
        } else {
          nullCount++;
        }
      }
      console.log(`Difference = ${difference}, nullCount=${nullCount}`);
      if(nullCount !== 0){
        difference = difference/nullCount;
        for(let [key, value] of Object.entries(bill.tAccount)){
          if(value===null){
            bill.tAccount[key] = difference;
          }
        }
      }
      await updateDoc(transactionRef, bill.tAccount);
    }
  } else {
    throw new Error('Transaction document does not exist.');
  }
}






