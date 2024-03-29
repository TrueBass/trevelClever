import { React, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { InputField, PrimaryButton, FriendTitle } from "../components";

import { auth } from '../backend/config';

import {
    findByNick,
    userUidObj,
    addFriendId,
} from '../models/test';

export default function FriendsScreen(){
    // didn't applied addFriend yet
    const [friendNickname, setFriendNickname] = useState('');
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [searchResultText, setSearchResultText] = useState(<Text>There are no friends yet...</Text>);

    function confirmButtonHandler(){
        findByNick(friendNickname);
        console.log(userUidObj);
        if(Object.keys(userUidObj).length !== 0){
            // userUidObj is from findByNick func
            setSearchResultText(
                <FriendTitle
                    nickname={userUidObj.nickname}
                    profilePhoto={userUidObj.profilePhotoUrl}
                />
            );
        }
        else{
            setSearchResultText(<Text>There is no such friend...</Text>);
        }
    }
    
    return (
        <View>
            <InputField
                onChangeText={(text)=>setFriendNickname(text)}
                placeholder={"input friend's nickname"}
                value={friendNickname}
            />
            {searchResultText}
            <PrimaryButton onPress={confirmButtonHandler}>
                Confirm
            </PrimaryButton>
        </View>
    );
}

// const styles = StyleSheet.create({

// });