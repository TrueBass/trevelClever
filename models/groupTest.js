import { fs } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import { collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc, arrayUnion, where, doc, getFirestore, query} from 'firebase/firestore';
import Groups from './groupsSchema/';
/**
 * Creates a group for a specific user in the Firestore. ➥ Returns groupId
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
 * 
 * Note: The 'Groups' constructor is used here to create an object with a predefined structure. Use import Groups from 'your/path/models/groupsSchema/';
 *
 * @return {Promise<void>} groupId if successful
 */
export const addGroup = async (userId) => {
  try {
    // Reference to Firestore collection
    const groupsRef = collection(fs, `groups`);
    // Create a new group instance
    let newGroup = new Groups(false, [userId], null, null, null, null, null);
    // Add a new document with an auto-generated ID
    const docRef = await addDoc(groupsRef, Object.assign({}, newGroup));
    console.log("Group created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error performing database operation:", error.message);
  }
};
/**
 * Updates the specified group's information.
 * 
 * @param {string} userId - The unique ID of the current user.
 * @param {string} groupId - The unique ID of the group.
 * @param {Groups} newGroup - The new group data object to replace the existing group information.
 * 
 * Note: The 'newGroup' parameter should contain the new details for the group. The 'Groups' constructor is used here to create an object with a predefined structure.
 * Use import Groups from 'your/path/models/groupsSchema/';
 * 1. active 2. master 3. members[id:true], 4. name, 5. totalSpent 6.  transactions, 7. groupDebts
 * @return {Promise<void>} A promise that resolves with no value when the group information is successfully updated, or rejects with an error if the update fails.
 */
export async function editGroup(groupId, newGroup) {
  // Reference to Firestore document
  const groupDocRef = doc(fs, `groups/${groupId}`);

  try {
    // Update the existing group document
    await updateDoc(groupDocRef, Object.assign({}, newGroup));
    console.log('Group information updated successfully.');
  } catch (error) {
    console.error('Error updating group information:', error.message);
    throw error; 
  }
}
/**
 * Updates the name of a specified group for a specific user.
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
 * @param {string} groupId - The unique identifier of the group.
 * @param {string} newName - The new name to be set for the group.
 * 
 * This function constructs a reference to the specific group within the user's data in the database using the user ID and group ID.
 * It then creates an updates object, which contains the new name for the group.
 * 
 * The function attempts to update the group's name at the constructed database reference path. If the update operation is successful, 
 * it logs a success message indicating that the group name has been updated. If there is an error during the update, it logs a detailed 
 * error message including the group ID and rethrows the error for further handling.
 * 
 * @return {Promise<void>} A promise that resolves without a value if the group name is successfully updated, or rejects with an error if the update fails.
 */
export async function editGroupName(groupId, newName) {
  // Reference to Firestore document
  const groupDocRef = doc(fs, `groups/${groupId}`);
  try {
    await updateDoc(groupDocRef, { name: newName });
    console.log(`Group name updated successfully to '${newName}' for group: ${groupId}`);
  } catch (error) {
    console.error(`Error updating group name for group: ${groupId}`, error.message);
    throw error; 
  }
}
/**
 * Removes a specified group from the Firebase under the conditions:
 *    1) that all the transactions are closed
 *    2) the user is a master.
 * @param {string} userId - The unique ID of the user.
 * @param {string} groupId - The unique identifier of the group to be removed.
 * 
 * If the group exists and the `active` flag within its data is set to `false`, it proceeds to remove the group
 * from the database.
 * 
 * This function is designed to prevent the accidental deletion of active groups by enforcing a check on the `active` flag within the group data.
 * 
 * @return {Promise<void>} A promise that resolves without a value if the group is successfully removed or if the group does not exist or is active.
 * The promise rejects with an error if there's an issue with reading the group data or removing the group from the database.
 */
export async function removeGroup(userId, groupId) {
  // Reference to Firestore document
  const groupDocRef = doc(fs, `groups/${groupId}`);

  try {
    const groupSnapshot = await getDoc(groupDocRef);
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.data();
      // Check if the `active` flag is `false` before proceeding with removal
      if(groupData.master === userId){
        if (groupData.active === false) {
          await deleteDoc(groupDocRef);
          showMessage({
            message: "Success",
            description: "Inactive group has been removed successfully",
            type:"success",
            duration: 3000,
            icon: { position: "left", icon: "success" },
          });
          console.log(`Inactive group '${groupId}' has been removed successfully.`);
        } else {
          console.log(`Group '${groupId}' is active and will not be removed.`);
          showMessage({
            message: "Warning",
            description: "Group is alive and will not be removed",
            type:"warning",
            duration: 3000,
            icon: { position: "left", icon: "warning" },
          });
        }
      }
      else{
        showMessage({
          message: "Warning",
          description: "Group has another master",
          type:"warning",
          duration: 3000,
          icon: { position: "left", icon: "warning" },
        });
      }

    } else {
      console.log(`Group '${groupId}' does not exist.`);
    }
  } catch (error) {
    console.error(`Error while attempting to remove group '${groupId}': `, error.message);
    throw error; 
  }
}
/**
 * @param {string} groupId - The unique identifier of the group whose members are being updated.
 * @param {string[]} memberIds - An array of members IDs that will be set as the members of the group.
 * Note: maybe i will put a creator of the group on the [0] place
 * This function updates the membership of the given group by setting the `memberIds`:true.
 * 
 * If the update is successful, a confirmation message is logged to the console.
 * If an error occurs during the update, it logs an error message and the promise is rejected with the error.
 * 
 * @return {Promise<void>}
 */
export async function updateGroupMembers(groupId, memberIds) {
  // Reference to Firestore document
  const groupDocRef = doc(fs, `groups/${groupId}`);

  try {
    // Firestore transaction for adding members to the array
    await updateDoc(groupDocRef, {
      members: arrayUnion(...memberIds)
    });
    console.log(`Group members updated successfully for group: ${groupId}.`);
  } catch (error) {
    console.error(`Error updating group members for group: ${groupId}`, error.message);
    throw error; 
  }
}

/**
 * Asynchronously retrieves the list of group IDs that a user is a part of, 
 *                                                      either as the master or as a member.
 *
 * @param {string} userId - The unique ID of the user whose groups are being fetched.
 * This function performs asynchronous requests to query the Firestore database for groups where the user
 * is either the 'master' or listed within 'members' of the group.
 *
 * It fetches two sets of groups: one where the user is the master and another where the user is a member.
 * The results of these queries are combined, and the unique group IDs are extracted and returned.
 *
 * @return {Promise<Array<string>>} A promise that resolves to an array of group IDs where the user is
 * either a master or a member. If an error occurs during the operation, the promise rejects with an
 * error message.
 */
export async function getUserGroups(userId) {
    const fs = getFirestore(); // Initialize Firestore instance
    const groupsCollectionRef = collection(fs, 'groups');
    const q = await query(groupsCollectionRef,
    where('master', '==', userId));
    const groups = await getDocs(q);
    const memberQuery = query(groupsCollectionRef, where('members', 'array-contains', userId));
    const groups2 = await getDocs(memberQuery);
    
  try {
    const combinedList = [...groups.docs, ...groups2.docs];
    const uniqueIdsSet = new Set(combinedList.map(group => group.id));
    const returnGroupIds = Array.from(uniqueIdsSet);
    return returnGroupIds;
  }catch (error) {
    console.error('Errore');
  } 
}


/**
 * @param {string} userId - The unique ID of the user associated with the group.
 * @param {string} groupId - The unique identifier of the group.
 *Asynchronously sets changes the active status of a user's group
 *  ➔ to FALSE to indicate that the group has paid all bills. 
 *    🐝 ONLY the master can disactivate a group
 *  ➔ to TRUE to indecate that there are bills.
 *    🐝 EVERY member can activate it
 * @return {Promise<void>}
 */
export async function toggleActiveState(userId, groupId) {
  const groupDocRef = doc(fs, `groups/${groupId}`);
  try {
    const groupSnapshot = await getDoc(groupDocRef);
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.data();
      console.log(groupData.master);
      const master = groupData.master;
      const activeState = groupData.active;
      if (activeState === false || userId === master) {
        const currentActiveState = Boolean(groupData.active);
        await updateDoc(groupDocRef, { active: !currentActiveState });
        console.log(`Group ${groupId} active state toggled to ${!currentActiveState} for user ${userId}`);
      } else {
        showMessage({
          message: "Sorry",
          description: "Only the master can toggle the active state",
          type: "warning",
          duration: 3000,
          icon: { position: "left", icon: "warning" },
        });
      }
    } else {
      throw new Error(`Group ${groupId} does not exist for user ${userId}`);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronously retrieves detailed data for a specific group belonging to a user.
 *
 * @param {string} groupId - The unique identifier of the group whose data is being retrieved.
 *The data includes the active status, members, name, total spent amount, transactions, and group debts.
 *
 * The function returns an instance of the 'Groups' class populated with the group's data. If no group is found for the specified
 * groupId, it console.logs a message and returns null.
 *
 * Note: The 'Groups' class constructor expects the group's active status, members, name, total
 * spent amount, transactions, and debts data in that order. Ensure that the 'Groups' class is
 * defined and available in scope when using this method.
 *
 * @return {Promise<Groups|null>} A promise that resolves with an instance of the 'Groups' class
 * containing the group's data, or null if the group does not exist.
 */
export async function getGroupSnapshot(groupId) {
  const groupDocRef = doc(fs, `groups/${groupId}`)
  try {
    const snapshot = await getDoc(groupDocRef);
    if (snapshot.exists()) {
      const groupData = snapshot.data();
      return new Groups(
        groupData.active,
        groupData.members,
        groupData.name,
        groupData.totalSpent,
        groupData.transactions,
        groupData.groupDebts
      );
    } else {
      console.log("No snapshot excists: ", groupId);
      return null; // or you can throw an error or handle this case as you see fit
    }
  } catch (error) {
    console.error("Error getDoc group data:", error);
  }
}

/**
 * @param {string} userId - The ID of the owner.
 * @param {string} groupId - The ID of the group.
 * @param {string} memberId - The ID of the member to be deleted from the group.
 *  ➔ a user (the master) cannot delete themselves from the group.
 * @return {Promise<void>} A promise that resolves when the deletion is complete or rejects with an error.
 */
export async function deleteGroupMember(groupId, memberId) {
  const groupDocRef = doc(fs, `groups/${groupId}`);
  const snapic = await getDoc(groupDocRef)
  let masterId = ""
  let membersList= []
  if(snapic.exists()){
    const snapicData = snapic.data()
    masterId = snapicData.master
    membersList = snapicData.members

    if (masterId === memberId) {
      showMessage({
        message: "Error",
        description: "You cannot delete the master",
        type: "warning",
        duration: 3000,
        icon: { position: "left", icon: "warning" },
      });
    } else {
      try {
        await updateDoc(memberDocRef, {
          deleted: firestore.FieldValue.delete()
        });
        console.log(`Member ${memberId} deleted successfully from group: ${groupId}.`);
      } catch (error) {
        showMessage({
          message: "Error",
          description: "We failed to delete a member",
          type: "warning",
          duration: 3000,
          icon: { position: "left", icon: "warning" },
        });
        console.error(`Error deleting member ${memberId} from group: ${groupId}`, error.message);
        throw error;
      }
    }
  }
 else{
  console.log("No snapshot excists: ", groupId);
 }
  
}