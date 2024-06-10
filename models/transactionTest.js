import { fs } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import { collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc, arrayUnion, where, doc, getFirestore, deleteField, Timestamp} from 'firebase/firestore';
import Transactions from './transactionsSchema/';
/**
 * Gets the local current timestamp in Firestore's `Timestamp` format.
 * 
 * This function retrieves the current local date and time and converts it into a Firestore `Timestamp` object.
 * 
 * @returns {firebase.firestore.Timestamp} The current local timestamp.
 */
export function getLocalTime(){
  const localDate = new Date(); // Gets the local current time
  const localTimestamp = Timestamp.fromDate(localDate);
  return localTimestamp;
}
/**
 * Asynchronously retrieves the snapshot of a transaction.
 * 
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} transactionId - The ID of the transaction document to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to the transaction document data if successful.
 * @throws {Error} Throws an error if the transaction document does not exist.
 */
export async function getTransactionSnapshot(transactionId) {
  const transactionRef = doc(fs, `transactions/${transactionId}`);
  const transactionSnapshot = await getDoc(transactionRef);

  if (transactionSnapshot.exists()) {
      return transactionSnapshot.data();
  } else {
      throw new Error("Transaction with ID ${transactionId} does not exist.");
  }
}
/**
 * Asynchronously updates the reference to a bill in a group's document.
 * @param {firebase.firestore.Firestore} fs - The Firestore instance.
 * @param {string} groupId - The ID of the group document to be updated.
 * @param {string} billId - The ID of the bill to be referenced.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} Logs an error message if the update operation fails.
 */
export const updateReference = async (groupId, billId) => {
try {
  const groupRef = doc(fs, `groups/${groupId}`);
await updateDoc(groupRef, { [`transactions.${billId}`]: true });
} catch (error) {
  console.error("Error updating a group:", error.message);
}  
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
export const addBill = async (newBill, groupId) => {
  try {
    const billRef = collection(fs, 'transactions');
    if (newBill.tAccount instanceof Map) {
      newBill.tAccount = Object.fromEntries(newBill.tAccount);
    }
    const docRef = await addDoc(billRef, Object.assign({}, newBill)); // Await here
    console.log("Trans created with ID:", docRef.id);

    updateReference(groupId, docRef.id);
    return docRef.id;
  
}catch (error) {
    console.error("Error performing database operation:", error.message);
  }
 
};
/**
 * Asynchronously deletes 🗑️ a bill from the Firestore collection by its document ID.* 
 * @param {string} transactionId - The ID of the document representing the bill to be deleted.
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete,
 *   or rejects with an error if the operation fails.
 */
export const deleteBill = async (transactionId, groupId) => {
  try {
    // Reference to Firestore collection
    const billRef = doc(fs, `transactions/${transactionId}`);
    await deleteDoc(billRef);
    console.log("Transaction deleted with ID:", transactionId);
  }catch (error) {
    console.error("Error performing database operation:", error.message);
  }
    // Update the group document (if groupId is provided)
    if (groupId) {
      const groupRef = doc(fs, `groups/${groupId}`);
      await updateDoc(groupRef, { [`transactions.${transactionId}`]: deleteField() });
      
      const groupDoc = await getDoc(groupRef);
      if (groupDoc.exists() && Object.keys(groupDoc.data().transactions).length === 0) {
      await toggleActiveState(userId, groupDoc.data().master);
    }
      } else {
        console.warn("No reference to transaction found in group.");
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
  const delRef = `tAccount.${memberId}`;
  await updateDoc(transactionRef, { [delRef]: deleteField() });
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

    const divider = Object.keys(bill.tAccount).length; // Potential issue if tAccount is empty

    if (divider === 0) { // Handle case where there are no members (division by zero)
      // You might want to throw an error or handle this scenario differently
      return;
    }
    if (bill.tSplitType === 0) {
      let debt = bill.tPayment[0] / divider;
      debt = Number(debt.toFixed(2));
      // Update all members' debts to be equal.
      const updates = {};
      for (let memberId in bill.tAccount) {
        updates[`tAccount.${memberId}`] = debt; // Potential issue if memberId doesn't exist
      }
      await updateDoc(transactionRef, { tAccount: updates });
    } else if (bill.tSplitType === 1) {
      let difference = bill.tPayment[0]; // To keep track of remainder
      let nullCount = 0; // To count how many keys have null values

      for (let key in bill.tAccount) {
        // Potential issue if a key doesn't exist or has an unexpected type (not a number)
        if (bill.tAccount !== null && bill.tAccount[key] < 0) {
          difference += bill.tAccount[key]; //absolute value
        } else {
          nullCount++;
        }
      }

      console.log("total bill is ", bill.tPayment[0]);
      console.log(`Difference = ${difference}, new memebers to account=${nullCount}`);

      if (nullCount !== 0) {
        updatedTAccount = {}
        difference = difference / nullCount;
        difference = Number(difference.toFixed(2));
        for (let [key, value] of Object.entries(bill.tAccount)) {
          if (value === null || value > 0) {
          updatedTAccount[key] = difference;
        } else {
          updatedTAccount[key] = value; // Preserve existing values for non-null, positive values
        }
      }
      await updateDoc(transactionRef, { tAccount: updatedTAccount });
      }
    }
      
    } else {
      throw new Error('Transaction document does not exist.');
    }
}
/**
 * Asynchronously finds all transactions that have a certain groupId and userId.
 * 
 * @param {string} groupId - The groupId to search for.
 * @param {string} userId - The userId to search for in fields tPayer and tAccount.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of transactions matching the criteria,
 *   or rejects with an error if the operation fails.
 */
export const findTransactions = async (groupId, userId) => {
  try {
    const groupRef = doc(fs, `groups/${groupId}`);
    const groupDoc = await getDoc(groupRef);
    
    if (groupDoc.exists()) {
      const transactions = groupDoc.data().transactions;
      const userTransactions = [];

      for (const [transactionId, value] of Object.entries(transactions)) {
        if (value) {
          const transactionRef = doc(fs, `transactions/${transactionId}`);
          const transactionDoc = await getDoc(transactionRef);
          
          if (transactionDoc.exists()) {
            const transactionData = transactionDoc.data();

            if (transactionData.tAccount && transactionData.tAccount[userId] !== undefined) {
              userTransactions.push({ transactionId, ...transactionData });
            }
          }
        }
      }

      return userTransactions;
    } else {
      console.error("No such group document!");
      return [];
    }
  
  } catch (error) {
    console.error("Error performing database operation:", error.message);
    return [];
  }
};











