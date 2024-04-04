import { React, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { InputField, PrimaryButton, FriendTitle } from "../components";

import { auth } from '../backend/config';

import {
    findByNick,
    addFriendId,
} from '../models/test';

export default function FriendsScreen(){

    const [friendNickname, setFriendNickname] = useState('');
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [searchResultText, setSearchResultText] = useState(<Text style={{fontSize: 20}}>Try to find someone</Text>);
    const [friendsFlatList, setFriendsFlatList] = useState(<Text style={{fontSize: 20}}>Flipping twist💀 Where are ur friend?</Text>);

    async function confirmButtonHandler(){
        // this is working great now
        // because of async/await.
        const resultUserObj = await findByNick(friendNickname.trim()); // code res: 400 - bad(
        
        if(resultUserObj === 400)
            setSearchResultText(<Text style={{fontSize: 20}}>There is no such friend...</Text>);
        else
            setSearchResultText(<FriendTitle nickname={resultUserObj.nickname} profilePhoto={resultUserObj.profilePhotoUrl}/>);
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
                    onChangeText={(text) => setFriendNickname(text)}
                    placeholder={"input friend's nickname"}
                    value={friendNickname}
                />
            </View>
            <View style={styles.messageView}>
                <View style={styles.messageViewFriendInfo}>
                    {searchResultText}
                </View>
                <View style={styles.messageViewFlatList}>
                    {friendsFlatList}
                </View>
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
    },
    input: {
        // flex: 1,
        marginHorizontal: 20,
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageView: {
        flex: 6,
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginHorizontal: 20,
        marginVertical: 10,
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageViewFriendInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageViewFlatList: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#a362cfff',
        // borderWidth:1,
        // borderColor: 'red',
    },
    buttonView: {
        flex: 2,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginHorizontal: 20,
        borderWidth:1,
        borderColor: 'red',
    },
});