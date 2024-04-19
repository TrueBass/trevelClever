import { db } from '../backend/config';
import { showMessage } from "react-native-flash-message";
import {
    ref,
    get,
    update,
    query,
    remove,
    equalTo,
    child,
    push,
    set,
    orderByChild,
} from "@firebase/database";
import Groups from './groupsSchema/';
/**
 * Updates a group's details for a specific user in the Firebase Realtime Database.
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
 * @param {string} groupId - The identifier of the group to be updated.
 * @param {Groups} newGroup - The new group data to be updated. Expected to be an instance of the Groups class.
 * 
 * Note: The 'Groups' constructor is used here to create an object with a predefined structure. Use import Groups from 'your/path/models/groupsSchema/';
 *
 * After instantiation, the 'editGroup' function will push a unique ID with empty group. False status -> no transactions have been made.
 * 
 * @return {Promise<void>} A promise that resolves if the update was successful, and rejects with an error if the update fails.
 */
export const addGroup = async (userId) => {
  const groupsRef = ref(db, `users/${userId}/groups/`);
  try {
    // Add an auto-generated ID
    const newGroupsRef = push(groupsRef);
    let newGroup = new Groups(false, {[userId]:true}, null, null, null, null);
    // Save the new group to the db
    await update(newGroupsRef, newGroup);
    console.log("Group created successfully.");
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
export async function editGroup(userId, groupId, newGroup){
    //newGroup = new Groups(true, {"kec78HNqQeNNjTKJzQcLvwdHvFk2": true}, "Hole", null, null, null);// for etit group function
    const groupRef = ref(db, `users/${userId}/groups/${groupId}`);
    try {
    await update(groupRef, newGroup);
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
export async function editGroupName(userId, groupId, newName){
    const groupRef = ref(db, `users/${userId}/groups/${groupId}`);
    const updates = {
        name: newName 
      };
      try {
        await update(groupRef, updates);
        console.log(`Group name updated successfully to '${newName}' for group: ${groupId}`);
      } catch (error) {
        console.error(`Error updating group name for group: ${groupId}`, error.message);
        throw error; 
      }
}
/**
 * Removes a specified group from the Firebase under the condition that all the transactions are closed.
 * 
 * @param {string} userId - The unique ID of the user who owns the group.
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
    const groupRef = ref(db, `users/${userId}/groups/${groupId}`);
    try {
      // First, get the group data to check the `active` flag
      const groupSnapshot = await get(groupRef);
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.val();
        // Check if the `active` flag is `false` before proceeding with removal
        if (groupData.active === false) {
          await remove(groupRef);
          console.log(`Inactive group '${groupId}' has been removed successfully.`);
        } else {
          console.log(`Group '${groupId}' is active and will not be removed.`);
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
 * @param {string} userId - The unique ID of the user who owns the group.
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
export async function updateGroupMembers(userId, groupId, memberIds) {
    const membersUpdate = {};
    memberIds.forEach(memberId => {
      membersUpdate[`users/${userId}/groups/${groupId}/members/${memberId}`] = true;
    });
    try {
      await update(ref(db), membersUpdate);
      console.log(`Group members updated successfully for group: ${groupId}.`);
    } catch (error) {
      console.error(`Error updating group members for group: ${groupId}`, error.message);
      throw error; 
    }
}
/**
 * Asynchronously retrieves the groups that a user is a part of.
 *
 * @param {string} userId - The unique ID of the user whose groups are being fetched.
 * It uses an asynchronous request to get the groups data.
 *
 * If the groups data exists for the user, the function returns it as an object where each key
 * represents a group ID the user is part of, and each value is `true` (indicating membership).
 * Otherwise, an empty object is returned.
 *
 * @return {Promise<Object>}
 */
export async function getUserGroups(userId) {
  try {
    const userGroupsRef = ref(db, `users/${userId}/groups`);
    const snapshot = await get(userGroupsRef);
    if (snapshot.exists()) {
      return snapshot.val(); 
    } else {
      console.log('User is not part of any groups.');
      return {};
    }
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw error;
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
  const groupRef = ref(db, `users/${userId}/groups/${groupId}/`);
  try {
    const groupSnapshot = await get(groupRef);
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.val();
      console.log(groupData.master);
      const master = groupData.master;
      const activeState = groupData.active;
      if (activeState === false || userId === master) {
        const currentActiveState = Boolean(groupData.active); 
        await update(groupRef, { active: !currentActiveState });
        console.log(`Group ${groupId} active state toggled to ${!currentActiveState} for user ${userId}`);
      } else {
        showMessage({
          message: "Sorry",
          description: "Only the master can close bills",
          type: "warning",
          duration: 3000,
          icon: { position: "left", icon: "warning" },
        });
        throw new Error(`User ${userId} is not authorized to change the active state of group ${groupId}`);
      }
    } else {
      throw new Error(`Group ${groupId} does not exist for user ${userId}`);
    }
  } catch (error) {
    console.error(`Error '${groupId}': `, error.message);
    throw error; 
  }
}
/**
 * Asynchronously retrieves detailed data for a specific group belonging to a user.
 *
 * @param {string} userId - The unique ID of the user who is associated with the group.
 * @param {string} groupId - The unique identifier of the group whose data is being retrieved.
 *The data includes the active status, members, name, total spent amount, transactions, and group debts.
 *
 * The function returns an instance of the 'Groups' class populated with the group's data. If no group is found for the specified
 * groupId, it logs a message to the console and returns null.
 *
 * Note: The 'Groups' class constructor expects the group's active status, members, name, total
 * spent amount, transactions, and debts data in that order. Ensure that the 'Groups' class is
 * defined and available in scope when using this method.
 *
 * @return {Promise<Groups|null>} A promise that resolves with an instance of the 'Groups' class
 * containing the group's data, or null if the group does not exist.
 */
export async function getGroupSnapshot(groupId) {
  const groupRef = ref(db, `users/${userId}/groups/${groupId}/`);
  try {
    const snapshot = await get(groupRef);
    if (snapshot.exists()) {
      const groupData = snapshot.val();
      return new Groups(
        groupData.active,
        groupData.members,
        groupData.name,
        groupData.totalSpent,
        groupData.transactions,
        groupData.groupDebts
      );
    } else {
      console.log("No group found for the specified groupId:", groupId);
      return null; // or you can throw an error or handle this case as you see fit
    }
  } catch (error) {
    console.error("Error getting group data:", error);
  }
}
/**
 * @param {string} userId - The ID of the owner.
 * @param {string} groupId - The ID of the group.
 * @param {string} memberId - The ID of the member to be deleted from the group.
 *  ➔ a user (the master) cannot delete themselves from the group.
 * @return {Promise<void>} A promise that resolves when the deletion is complete or rejects with an error.
 */
export async function deleteGroupMember(userId, groupId, memberId) {
  const memberDelete = {};
  // Set the member's value to null to delete it from the group
  if (userId === memberId) {
    showMessage({
      message: "Error",
      description: "You cannot delete the master",
      type: "warning",
      duration: 3000,
      icon: { position: "left", icon: "warning" },
    });
    console.log("did you try to delete the master? ");
  }
  else {
    memberDelete[`users/${userId}/groups/${groupId}/members/${memberId}`] = null;
    try {
      await update(ref(db), memberDelete);
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