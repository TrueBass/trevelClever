
import {db} from '../backend/config'
import {ref, orderByChild, on, update, equalTo, get } from 'firebase/database';
import User from './usersSchema';
const usersRef = ref(db, 'user');
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
// export const addFieldWithValue = (collectionName, objId, fieldName, fieldValue) =>{
//     //Push new field with a value
//     const collectionRef = ref(db, collectionName+'/'+objId);
//         try {
//             const updateData = {
//                 [fieldName] : fieldValue
//             };
//             update(collectionRef, updateData);
//             console.log("Data was successfully added.");
//           } catch (error) {
//             console.error("Error adding new data. ", error.message);
//           }
// };
// export const addFriendId = (userId, friendId) =>{
//     //push friend's id with a True flag. (it is the way to implement ∞ ↔︎ ∞)
//     const friendsRef = ref(db, "users/"+userId);
//         try {
//             const updateData = {
//                 [friendId] : true
//             };
//             update(friendsRef, updateData);
//             console.log("Your friend was successfully added.");
//           } catch (error) {
//             console.error("Error adding the friend ", error.message);
//           } 
// };
//Function to search by neckname. note, i added indexing on nickname, so the search performs faster
// export const testrun = (searchedNickname) => {
//     // Construct a query to filter users by nickname
//     const query = orderByChild(usersRef, "nickname").equalTo(searchedNickname);
//     // Attach a listener to the query to receive the search results
//     on(query, "value", (snapshot) => {
//         // Iterate over the search results
//         snapshot.forEach((childSnapshot) => {
//             const user = childSnapshot.val();
//             console.log(user); // Print the user data
//         });
//     });
// };

