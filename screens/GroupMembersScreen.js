import React, {useState} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { PrimaryButton } from "../components";
import FriendsChecklist from "../components/FriendsChecklist";

import { findUserByUid } from "../models/test";
import { updateGroupMembers } from "../models/groupTest";

export default function GroupMembersScreen({ groupObj, onBack, isMaster }){
    const [membersList, setMembersList] = useState([]);
    const [membersListChanged, setMembersListChanged] = useState(true);
    const [checkedFriendsToAdd, setCheckedFriendsToAdd]= useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [masterNick, setMasterNick]= useState("");

    async function refreshList(){
        const tempList = [];

        for(const id of groupObj.members){
            const memberObj = await findUserByUid(id);
            memberObj?.nickname &&
            tempList.push({id, nickName: memberObj.nickname});
        }

        setMembersList(tempList);
    }

    function pushCheckedFriend(idList){
        setCheckedFriendsToAdd([...idList]);
    }

    function doneAddingFriends(checkedList){
        (async()=>{
            await updateGroupMembers(groupObj.id, checkedList);
        })();
        setMembersList([...membersList, ...checkedList]);
        setMembersListChanged(true);
    }

    if(!isMaster){
        (async () =>{
            let masterNick = await findUserByUid(groupObj.master);
            setMasterNick(masterNick.nickname);
        })();
    }

    if(membersListChanged){
        refreshList();
        setMembersListChanged(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.topButtons}>
                <Icon name="chevron-left"
                    size={30}
                    onPress={onBack}
                />
            </View>
            {
                !isMaster?
                <Text style={{marginHorizontal: 10,fontSize: 20, color: '#a30f0f'}}>
                    Owner: {masterNick}
                </Text>:
                <></>
            }
            <FlatList
                ListEmptyComponent={
                    <Text style={{fontSize: 32, textAlign: 'center'}}>
                        There are no members yet
                    </Text>
                }
                data={membersList}
                keyExtractor={item => item.id}
                renderItem={({item}) => 
                    <View style={{margin: 10, alignItems: 'center', borderWidth: 1, borderRadius: 8}}>
                        <Text style={
                            [
                                styles.memberNickname,
                                {
                                    color: item.id === groupObj.master?'red':'black'
                                }
                            ]}
                        >
                            {item.nickName}
                        </Text>
                    </View>
                }
                style={styles.flatList}
            >
            </FlatList>
            {
                isMaster?
                <View style={styles.addButton}>
                    <PrimaryButton onPress={()=>setModalVisible(true)}>
                        Add a member
                    </PrimaryButton>
                    <FriendsChecklist onCheck={pushCheckedFriend}
                        visibleProp={modalVisible}
                        setVisibleProp={setModalVisible}
                        checkedList={checkedFriendsToAdd}
                        onDone={doneAddingFriends}
                        currMembers={groupObj.members}
                    />
                </View>:
                <></>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    flatList: {
        backgroundColor: 'purple',
        margin: 10,
        borderRadius: 16
    },
    memberNickname: {
        fontSize: 32,
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    }
});
