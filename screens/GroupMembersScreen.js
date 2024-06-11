import React, {useState} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { PrimaryButton } from "../components";
import FriendsChecklist from "../components/FriendsChecklist";

import { findUserByUid } from "../models/test";
import { deleteGroupMember, updateGroupMembers } from "../models/groupTest";
import { STYLES } from "../utils/colors";

export default function GroupMembersScreen({ groupObj, onBack, isMaster }){
    const [membersList, setMembersList] = useState([]);
    const [membersListChanged, setMembersListChanged] = useState(true);
    const [checkedFriendsToAdd, setCheckedFriendsToAdd]= useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [masterNick, setMasterNick]= useState("");
    const [currMembersList, setCurrMembersList] = useState(groupObj.members);

    async function refreshList(){
        if(!groupObj.members)
            return;

        const tempList = [];
        for(const id of groupObj.members){
            const memberObj = await findUserByUid(id);
            memberObj?.nickname &&
            tempList.push({id, nickName: memberObj.nickname});
        }

        setMembersList(tempList);
    }
    async function refreshListOnDone(checkedList){
        const tempList = [];
        for(const id of checkedList){
            const memberObj = await findUserByUid(id);
            memberObj?.nickname &&
            tempList.push({id, nickName: memberObj.nickname});
        }

        setMembersList([...membersList,...tempList]);
    }

    function pushCheckedFriend(idList){
        setCheckedFriendsToAdd([...idList]);
    }

    function doneAddingFriends(checkedList){
        (async()=>{
            await updateGroupMembers(groupObj.id, checkedList);
            await refreshListOnDone(checkedList);
        })();
        setMembersListChanged(true);
    }

    function delMemberHandler(groupId,memberId){
        (async()=>await deleteGroupMember(groupId,memberId))();
        setMembersList(membersList.filter(elem => elem.id !== memberId));
        setCurrMembersList(currMembersList.filter(elem=>elem!== memberId));
        // setMembersListChanged(true);
    }

    if(!isMaster){
        (async () =>{
            let masterNick = await findUserByUid(groupObj.master);
            setMasterNick(masterNick.nickname);
        })();
    }

    if(membersListChanged){
        (async()=>await refreshList())();
        setMembersListChanged(false);
    }

    return (
        <View style={STYLES.container}>
            <View style={STYLES.topButtons}>
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
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-around',
                        margin: 10, borderWidth: 1, borderRadius: 8}}>
                        <Text style={styles.memberNickname}>
                            {item.nickName}
                        </Text>
                        {isMaster &&
                            <Icon name="delete-forever" size={32} color='red'
                                onPress={()=>delMemberHandler(groupObj.id,item.id)}
                            />
                        }
                    </View>
                }
                style={STYLES.flatList}
            >
            </FlatList>
            {
                isMaster?
                <View style={STYLES.addButton}>
                    <PrimaryButton onPress={()=>setModalVisible(true)}>
                        Add a member
                    </PrimaryButton>
                    <FriendsChecklist onCheck={pushCheckedFriend}
                        visibleProp={modalVisible}
                        setVisibleProp={setModalVisible}
                        checkedList={checkedFriendsToAdd}
                        onDone={doneAddingFriends}
                        currMembers={currMembersList}
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
