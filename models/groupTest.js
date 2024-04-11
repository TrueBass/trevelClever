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
//CREATE a group
export const addGroup = async (userId) => {
    //HANDLER
// async function handleAddGroup(userID) {
  //   try {
  //     await addGroup(userID); 
  //     console.log('Group added successfully!');
  //   } catch (error) {
      
  //     console.error('Failed to add group:', error.message);
  //   }
  // }
 
  // handleAddGroup(userID).then(() => {
  //   console.log('Handler has completed its execution.');
  // });
  const groupsRef = ref(db, `users/${userId}/groups/`);
  try {
    // Add an auto-generated ID
    const newGroupsRef = push(groupsRef);
    let newGroup = new Groups(true, null, null, null, null, null);
    // Save the new group to the db
    await update(newGroupsRef, newGroup);
    console.log("Group created successfully.");
  } catch (error) {
    console.error("Error performing database operation:", error.message);
  }
};
//ADD properties to freashly made group
export async function editGroup(userId, groupId, newGroup){
//HANDLER
//const userId = "BaJ6rgAelpfummrGipoNXQktip22";
//     const groupId = "-NuS9gCXxn68T3i0X9wU";
//   async function handleEditGroup(userId, groupId) {
//     try {
//       await editGroup(userId, groupId, {}); 
//       console.log('Group updated successfully!');
//     } catch (error) {
//       console.error('Failed to edit group:', error.message);
//     }
//   }
//   handleEditGroup(userId, groupId).then(() => {
//     console.log('Handler has completed its execution.');
//   });
    newGroup = new Groups(true, {"kec78HNqQeNNjTKJzQcLvwdHvFk2": true}, "Hole", null, null, null);// for etit group function
    const groupRef = ref(db, `users/${userId}/groups/${groupId}`);
    try {
    //update the group 
    await update(groupRef, newGroup);
    console.log('Group information updated successfully.');
  } catch (error) {
    console.error('Error updating group information:', error.message);
    throw error; 
  }



}
//EDIT a name
export async function editGroupName(userId, groupId, newName){
    //HANDLER
    // const userId = "BaJ6rgAelpfummrGipoNXQktip22";
    // const groupId = "-NuS9gCXxn68T3i0X9wU";
    // async function handleEditGroupField(userId, groupId) {
    //   try {
    //     await editGroupName(userId, groupId, "A Christian crusade");
    //     console.log('Group updated successfully!');
    //   } catch (error) {
    //     console.error('Failed handleEditGroupField:', error.message);
    //   }
    // }
    // handleEditGroupField(userId, groupId).then(() => {
    //   console.log('Handler has completed its execution.');
    // });
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
//REMOVES the group if it is INACTIVE
export async function removeGroup(userId, groupId) {
    // HANDLER
    // removeGroup(userId, groupId)
    // .then(() => console.log('Done with this group'))
    // .catch((error) => console.error('Failed to remove the group:', error));
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
//HANDLER
//     const memberIds = ['-Nt_-3QOVzxXcgvwE_eS']; 
//   updateGroupMembers(userId, groupId, memberIds)
//   .then(() => console.log('Members have been updated.'))
//   .catch((error) => console.error('Failed to update members:', error));

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
  
// RETRIEVE the list of groups for a user
export async function getUserGroups(userId) {
  try {
    const userGroupsRef = ref(db, `users/${userId}/groups`);
    const snapshot = await get(userGroupsRef);
    if (snapshot.exists()) {
      return snapshot.val(); 
      //console.log(snapshot.val());
    } else {
      console.log('User is not part of any groups.');
      return {};
    }
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw error;
  }
}