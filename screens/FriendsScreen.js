import { React, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { InputField, PrimaryButton, FriendTitle } from "../components";

import { auth } from '../backend/config';

import {
    findByNick,
    userUidObj,
    userFriendsArr,
    addFriendId,
} from '../models/test';

export default function FriendsScreen(){

    const [friendNickname, setFriendNickname] = useState('');
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [searchResultText, setSearchResultText] = useState(<Text>There are no friends yet...</Text>);

    async function confirmButtonHandler(){
        // this is working great now
        // because of async/await.
        await findByNick(friendNickname);
        console.log(userUidObj);
        console.log(userFriendsArr);
        if(Object.keys(userUidObj).length !== 0){
            // userUidObj is from findByNick func
            // contains val() from snapshot
            // FriendTitle - custom component
            setSearchResultText(<FriendTitle nickname={userUidObj.nickname} profilePhoto={userUidObj.profilePhotoUrl}/>);
        }
        else{
            setSearchResultText(<Text>There is no such friend...</Text>);
        }
    }

    async function addButtonHandler(){
        // this handler not doing well
        // but we'll fix it.
        addFriendId(currentUserUid, userUidObj.userId);
        setFriendNickname('');
    }
    
    return (
        <View style={styles.main}>
            <View style={styles.input}>
                <InputField
                    onChangeText={(text)=>setFriendNickname(text)}
                    placeholder={"input friend's nickname"}
                    value={friendNickname}
                />
            </View>
            <View style={styles.messageView}>
                {searchResultText}
            </View>
            <View style={styles.buttonView}>
                <PrimaryButton onPress={confirmButtonHandler}>
                    Confirm
                </PrimaryButton>
                <PrimaryButton onPress={addButtonHandler}>
                    Add
                </PrimaryButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-around',
        // alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    input: {
        flex: 1,
        
        borderWidth: 1,
        borderColor: 'red',
    },
    messageView: {
        flex: 3,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    buttonView: {
        flex: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        borderWidth: 1,
        borderColor: 'red',
    },
});