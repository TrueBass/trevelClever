import { db } from '../backend/config';

import {
    ref,
    get,
    update,
    query,
    equalTo,
    set,
    orderByChild,
} from "@firebase/database";

import { onAuthStateChanged } from '@firebase/auth'; 

import Users from './usersSchema';
import Transaction from './transactionsSchema';
import Group from './groupsSchema';
import { func } from 'prop-types';

const UserRef = ref(db, "users/");

// Define users
const users = [
    {
        email: "user1@gmail.com",
        password: "truebass",
        nickname: "UserOne"
    },
    {
        email: "user2@gmail.com",
        password: "truebass",
        nickname: "UserTwo"
    },
    {
        email: "TrueBass@gmail.com",
        password: "truebass",
        nickname: "AlphaUser"
    }
];

export const addFriendId = (userId, friendId) => {
    //push friend's id with a True flag. (it is the way to implement ∞ ↔︎ ∞)
    const friendsRef = ref(db, "users/" + userId + "/friends/");
    const numFriendRef = ref(db, "users/" + userId + "/numFriends");
    update(friendsRef, { [friendId]: true })
    .then(() => {
      console.log("Your friend was successfully added.");
      get(numFriendRef)
        .then((snapshot) => {
          let newCount;
          if (snapshot.exists()) {
            const currentCount = snapshot.val();
            newCount = (currentCount || 0) + 1; // Ensure we have a number
          } else {
            newCount = 1; // Initialize the friend count to 1 if it doesn't exist
            console.log("numFriendRef does not exist. Initializing friend count to 1.");
          }
          // Update the value directly using set
          set(numFriendRef, newCount).then(() => {
            console.log("Friend count updated to: ", newCount);
          }).catch((error) => {
            console.error("Error updating friend count", error);
          });
        })
        .catch((error) => {
          console.error("Error fetching numFriendRef", error);
        });
    })
    .catch((error) => {
      console.error("Error adding the friend ", error.message);
    });
};
export const removeFriendId = (userId, friendId) => {
    // Reference to friend's ID under the user's friends list.
    const friendsRef = ref(db, "users/" + userId + "/friends/");
    const numFriendRef = ref(db, "users/" + userId + "/numFriends")
    
    // Remove the friend's ID by setting the value to null.
    update(friendsRef, { [friendId]: null })
    .then(() => {
      console.log("Your friend was successfully removed.");
      get(numFriendRef)
        .then((snapshot) => {
          let newCount;
          if (snapshot.exists()) {
            const currentCount = snapshot.val();
            newCount = (currentCount || 1) - 1; // Ensure we have a number and do not go below 0
            if (newCount < 0) {
              newCount = 0; // Ensure we do not have negative friend counts
            }
          } else {
            newCount = 0; // If it doesn't exist or is already 0, keep it at 0
            console.log("numFriendRef does not exist or is already 0. Keeping friend count at 0.");
          }
          // Update the value directly using set
          set(numFriendRef, newCount).then(() => {
            console.log("Friend count updated to: ", newCount);
          }).catch((error) => {
            console.error("Error updating friend count", error);
          });
        })
        .catch((error) => {
          console.error("Error fetching numFriendRef", error);
        });
    })
    .catch((error) => {
      console.error("Error removing the friend", error.message);
    });
};

export const userUidObj = {}; // For findByNick func!
export function findByNick(findNick) {

  const queryUserByNickname = query(UserRef, orderByChild('nickname'), equalTo(findNick));
  get(queryUserByNickname).then((snapshot) => {
    if (snapshot.exists()) {
      userGet = snapshot.val();
      userUidObj.userId = Object.keys(userGet)[0];
      Object.keys(userGet[userUidObj.userId]).forEach((key)=>{
        // keys are adding automatically from finded user
        // to the exported userUidObj (we should call it in another way)
        // maybe this forEach will be changed to spread operator
        userUidObj[key] = userGet[userUidObj.userId][key];
      });
    } else {
      // if user hasn't been found
      // we should clear the userUidObj
      // or search will be always showing prev user
      Object.keys(userUidObj).forEach((key) => {
        // clearing the userUidObj
        // by setting all the keys to undefined
        delete userUidObj[key];
      });
      console.log("No users found");
    }
  }).catch((error) => console.log("Error, sorry", error));
}

// const reference = db().ref('/users/'+);