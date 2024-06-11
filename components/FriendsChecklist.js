import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, FlatList, SafeAreaView, Button } from "react-native";
import CheckBox from "react-native-check-box";
import { findUserByUid, getNick } from "../models/test";
import { auth } from "../backend/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";

export default function FriendsChecklist({currMembers = null, type = null, onCancel = null, visibleProp, setVisibleProp, onCheck, onDone = null}){
    const [nickNamesList, setNicknamesList] = useState([]);
    const [renderOnce, setRenderOnce] = useState(true);
    const [checkedNicksList, setCheckedNicksList] = useState([]);

    function onCheckNick(item){
        // don't touch, cuz my brain already has calluses
        if(!checkedNicksList.includes(item.id)){
            checkedNicksList.push(item.id);
        }else if(item.isChecked && checkedNicksList.length){
            const index = checkedNicksList.indexOf(item.id);
            checkedNicksList.splice(index,1);
        }
        onCheck(checkedNicksList);
    }
    
    function onBack(){
        // 1. give back ticked firends for adding
        // 2. hide this module
        onCheck(checkedNicksList);
        setRenderOnce(true);
        setVisibleProp(false);
    }
    
    async function renderList(){
        const currentUser = await findUserByUid(auth.currentUser.uid);
        if(currentUser?.friends && currentUser?.friends.length !== 0){
            const tempList = [];
            for (const id of Object.keys(currentUser?.friends)) {
                const nick = await getNick(id);
                tempList.push({id, nick, isChecked: false});
            }
            setNicknamesList(tempList);
        }
    }

    function onDoneAddingMembers(){
        if(currMembers !== null){
        if(checkedNicksList.length === 0){
            showMessage({
                message: "Hey!",
                description: "You didn't select any friend",
                type: "warning",
                duration: 3000,
                icon: { position: "left", icon: "warning" }
            });
            return;
        }
        for(const elem of checkedNicksList){
            if(currMembers.includes(elem)){
                showMessage({
                    message: "Warning!",
                    description: "Some of selected friends is already in a group.",
                    type: "warning",
                    duration: 3000,
                    icon: { position: "left", icon: "warning" },
                });
                return;
            }
        }}
        onDone(checkedNicksList);
        setCheckedNicksList([]);
        setVisibleProp(false);
    }

    if(renderOnce){
        // immidietly function invoking
        // cuz we don't have an async screen
        (async()=>{renderList()})();
        setRenderOnce(false);
    }

    return (
        <>
            <Modal transparent visible={visibleProp} >
                <SafeAreaView style={{flex: 1}} >
                    <View style={[styles.flatListView,{top: type==="group"?100:455, height: type==="group"?700:300}]}>
                        {   setVisibleProp !== null ?
                            <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                                <Icon name="chevron-left" size={24} onPress={onBack}/>
                                <Button title="Done" onPress={onDoneAddingMembers}/>
                            </View>:
                            <Icon name="account-multiple-check-outline"
                                size={30} style={{left: 355}}
                                onPress={onDone}
                            />
                        }
                        <FlatList
                            ListEmptyComponent={ ()=>
                                <Text style={{fontSize: 20}}>
                                    You have no friends yet...
                                </Text>
                            }
                            data={nickNamesList}
                            keyExtractor={item => item.id}
                            renderItem={({item})=>{
                                return <View style={styles.checkBoxView}>
                                    <CheckBox
                                        leftText={item.nick}
                                        leftTextStyle={{
                                            fontSize: 22, textAlign: 'center',
                                            color: item.isChecked?'green': 'black'
                                        }}
                                        isChecked={item.isChecked}
                                        onClick={()=>{
                                            onCheckNick(item);
                                            setNicknamesList((currList)=> {
                                                for(const i of currList){
                                                    if(i.id === item.id)
                                                        i.isChecked = !i.isChecked;
                                                }
                                                return [...currList];
                                            });
                                        }}
                                    />
                                </View>;
                            }}
                        >
                        </FlatList>
                        {
                            type==="group"&&
                            <Button onPress={onCancel} title="Cancel"/>
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    checkBoxView: {
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10
    },
    flatListView: {
        justifyContent: 'center',
        margin: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    }
});
