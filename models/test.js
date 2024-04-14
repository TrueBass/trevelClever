import { showMessage } from 'react-native-flash-message';
import { db } from '../backend/config';

import {
    ref,
    get,
    update,
    query,
    equalTo,
    set,
    orderByChild,
    runTransaction
} from "@firebase/database";

// import { onAuthStateChanged } from '@firebase/auth'; 

// import Users from './usersSchema';
// import Transaction from './transactionsSchema';
// import Group from './groupsSchema';
// import { func } from 'prop-types';
/**
 * 
 * @param {string} userUid 
 * @returns user's nickname {string}, if the uid is correct
 * \
 * if user hasn't been found, returns null
 */
export async function getNick(userUid){
  try{
    const nickRef = ref(db, 'users/' + userUid + '/nickname');
    const snapshot = await get(nickRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch(error){
    showMessage({
      message: "Error finding user",
      description: error.message || "Unknown error occurred",
      type: "danger",
      icon: { icon: "danger", position: "left" },
      duration: 3000
    });
  }
}


export async function findUserByUid(userUid){
  try{
    const snapshot = await get(ref(db, "users/"+userUid+"/"));
    return snapshot.exists() ? snapshot.val() : null;
  } catch(error){
    console.error(error.message);
  }
}
export async function addFriendId(userId, friendId) {
  try {
    const friendsRef = ref(db, `users/${userId}/friends/`);
    const numFriendRef = ref(db, "users/" + userId + "/numFriends");
    await update(friendsRef, { [friendId]: true });
    console.log("Your friend was successfully added.");
    //current friend count
    const snapshot = await get(numFriendRef);
    let newCount;
    if (snapshot.exists()) {
      const currentCount = snapshot.val();
      newCount = (currentCount || 0) + 1; 
    } else {
      newCount = 1; 
      console.log("numFriendRef does not exist. Initializing friend count to 1.");
    }
    await set(numFriendRef, newCount);
    console.log("Friend count updated to: ", newCount);
  } catch (error) {
    console.error("Error occurred during the friend addition process", error);
  }
}

export async function removeFriend(userId, friendId) {
  try {
    const friendsRef = ref(db, `users/${userId}/friends/`);
    const numFriendRef = ref(db, `users/${userId}/numFriends`);

    // Remove the friend's ID by setting the value to null
    await update(friendsRef, { [friendId]: null });
    console.log("Your friend was successfully removed.");

    // Atomically update the friend count using a transaction
    await runTransaction(numFriendRef, (currentCount) => {
      if (currentCount === null) {
        // If it doesn't exist, we assume it is 0
        return 0;
      }
      // Decrease the count but do not go below 0
      return Math.max(0, currentCount - 1);
    });

    const newCountSnapshot = await get(numFriendRef);
    console.log("Friend count updated to: ", newCountSnapshot.val());
  } catch (error) {
    console.error("Error occurred while removing friend or updating count", error);
  }
}

/**
 * Finds a friend by their nickname and returns their user object.
 * 
 * @param {string} findNick - The nickname of the friend to search for.
 * @returns {object} The user object of the found friend
 * \
 * \
 * if user hasn't been found, returns 400
 * \
 * \
 * object contains the following properties:
 *   - email {string} - The email address of the friend.
 *   - friends {object} - An object: keys friend IDs, vals: {boolean}
 *   - groups {object} - An object of group IDs.
 *   - nickname {string} - The nickname of the friend.
 *   - numFriends {number} - The number of friends the friend has.
 *   - password {string} - The password of the friend.
 *   - profilePhotoUrl {string} - The URL of the friend's profile photo.
 *   - transactions {object} - An object of transaction IDs.
 *   - uCurrency {number} - User's currency.
 *   - userId {string} - The unique ID of the friend.
 */
export async function findByNick(findNick) {
  try{
    const queryUserByNickname = query(UserRef, orderByChild('nickname'), equalTo(findNick));
    const snapshot = await get(queryUserByNickname);
    
    if (snapshot.exists()) {
      const userUidObj = {};
      userUidObj = 'a';
      userGet = snapshot.val();
      userUidObj.userId = Object.keys(userGet)[0]; // keys(): returns an array with one key we need (in this case)
      return Object.assign(userUidObj, userGet[userUidObj.userId]); // copying and returning an obj
    } else {
      return 400; // if we didn't find a user
    }
  }
  catch (error) {
    showMessage({
      message: "Error fetching user",
      description: error.message || "Unknown error occurred",
      type: "danger",
      icon: { icon: "danger", position: "left" },
      duration: 3000
    });
  }
}

// const reference = db().ref('/users/'+);