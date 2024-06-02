import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { showMessage } from "react-native-flash-message";

import { InputField, PrimaryButton, FriendTitle } from "../components";

import { auth } from '../backend/config';

import {
    findByNick,
    findUserByUid,
    getNick,
    addFriendId,
} from '../models/test';

export default function FriendsScreen(){
    const [friendNickname, setFriendNickname] = useState('');
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [searchResultText, setSearchResultText] = useState(<Text style={styles.messageViewText}>Try to find someone</Text>);
    const [userFriendsListData, setUserFriendsListData] = useState([]);
    const [isFriendsListChanged, setIsFriendsListChanged] = useState(true);

    async function refreshFriendsList(){
        if(isFriendsListChanged){
            const currentUser = await findUserByUid(currentUserUid);
            const tempFriendsList = [];
            if(currentUser?.friends && currentUser?.friends.length !== 0){
                for (const id of Object.keys(currentUser?.friends)) {
                    const nickname = await getNick(id);
                    tempFriendsList.push({id, nickname});
                }
            } else {
                setSearchResultText(<Text style={styles.messageViewText}>Oh My Days... U have no fliends😞</Text>);
            }
            setUserFriendsListData(tempFriendsList);
            setIsFriendsListChanged(false);
        }
    }

    async function confirmButtonHandler(){
        if(friendNickname === ''){
            showMessage({
                message: "Hej!",
                description: "Input some text to seach...",
                type: "warning",
                duration: 3000,
                icon: {position: "left", icon: "warning"},
            });
            return;
        }
        const findRes = await findByNick(friendNickname);
        
        if(findRes){
            setSearchResultText(<FriendTitle onPlusPress={addButtonHandler} nickname={findRes.nickname} profilePhoto={findRes.profilePhotoUrl}/>);
        }
        else{
            setSearchResultText(<Text style={{fontSize: 20, textAlign: 'center'}}>There is no such friend...</Text>);
        }
    }

    async function addButtonHandler(){
        if(friendNickname === ''){
            showMessage({
                message: "Hej!",
                description: "Input some text to seach...",
                type: "warning",
                duration: 3000,
                icon: {position: "left", icon: "warning"},
            });
            return;
        }

        const foundUserFriend = await findByNick(friendNickname);
        if(!foundUserFriend)
            return;

        await addFriendId(currentUserUid, foundUserFriend.userId);
        setIsFriendsListChanged(true);
        setFriendNickname('');
    }
    
    if(isFriendsListChanged) {
        refreshFriendsList();
    }

    return (
        <View style={styles.main}>
            <View style={styles.input}>
                <InputField
                    onSearch={confirmButtonHandler}
                    onChangeText={(text) => setFriendNickname(text.trim())}
                    placeholder={"input friend's nickname"}
                    value={friendNickname}
                    returnKeyType="search"
                />
            </View>
            <View style={styles.messageView}>
                <View style={styles.messageViewFriendInfo}>
                    {searchResultText}
                </View>
                <View style={styles.messageViewFlatList}>
                    <FlatList data={userFriendsListData} keyExtractor={item => item.id}
                        // ListHeaderComponent={()=>{return ( //maybe i'll delete this prop
                        //     <View style={{alignItems: "center", marginTop: 10}}>
                        //         <Text style={{fontSize: 20}}>Friends</Text>
                        //     </View>);
                        // }}
                        renderItem={({item}) => {
                            return (<View style={{margin: 10}}>
                                <FriendTitle onRemove={setIsFriendsListChanged} currentUserId={currentUserUid} friendId={item.id} nickname={item.nickname}/>
                            </View>);
                        }}
                    />
                </View>
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
        marginHorizontal: 20,
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageView: {
        flex: 6,
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginHorizontal: 20,
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageViewFriendInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        marginVertical: 10,
        // borderWidth:1,
        // borderColor: 'red',
    },
    messageViewText: {
        fontSize: 20,
        textAlign: 'center'
    },
    messageViewFlatList: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'stretch',
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#a362cfff',
        // borderWidth:1,
        // borderColor: 'red',
    }
});