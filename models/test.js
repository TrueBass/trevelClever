import {db} from '../backend/config';

import {
    ref,
    get,
    query,
    equalTo,
    orderByKey,
    orderByChild,
} from "@firebase/database";

import User from './usersSchema';
import Transaction from './transactionsSchema';
import Group from './groupsSchema';

const UserRef = ref(db, "users");

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

export default function testrun(){

    const queryUserByNickname = query(UserRef, orderByChild('nickname'), equalTo('UserOne'));

    get(queryUserByNickname).then((snapshot) => {
        if(snapshot.exists()){
            const userGet = snapshot.val();
            console.log(userGet);
        }else{
            console.log("No users found");
        }
    }).catch((error) => console.log("Error, sorry"));
}

// const reference = db().ref('/users/'+);