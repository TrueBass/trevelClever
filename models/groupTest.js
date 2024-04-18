import { db } from '../backend/config';

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
 * Note: A creator is a default member
 * @return {Promise<void>} A promise that resolves if the update was successful, and rejects with an error if the update fails.
 */
export const addGroup = async (userId) => {
  const groupsRef = ref(db, `users/${userId}/groups/`);
  try {
    // Add an auto-generated ID
    const newGroupsRef = push(groupsRef);
    let newGroup = new Groups(false, null, null, null, null, null);
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
 * Note: The 'newGroup' parameter should contain the new details for the group. The 'Groups' constructor is used here to create an object with a predefined structure. Use import Groups from 'your/path/models/groupsSchema/';
 *
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

//ADD new members
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
//RETRIEVE the list of groups for a user
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
//Make the goup inactive
export async function inactive(userId, groupId) {
  const groupActiveStatusRef = ref(db, `users/${userId}/groups/${groupId}/active`);
  try {
    await update(groupActiveStatusRef, { active: false });
    console.log(`Group ${groupId} active state set to false for user ${userId}`);
  } catch (error) {
    console.error(`Error while attempting to remove group '${groupId}': `, error.message);
    throw error; 
  }
}
// Get group's fields (group snapshot)
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