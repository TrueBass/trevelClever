import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import GroupItem from "../components/GroupItem";
import AddRoundButton from '../components/AddRoundButton';
import GroupInput from "../components/GroupInput";
import { auth } from '../backend/config';
import { addGroup, getUserGroups, getGroupSnapshot, editGroupName } from '../models/groupTest';
import GroupItemScreen from "./GroupItemScreen";

function GroupsScreen() {
    const [currentScreen, setCurrentScreen] = useState('Groups');
    const [currentGroupId, setCurrentGroupId] = useState(null);
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [ModalIsVisible, setModalIsVisible] = useState(false);
    const [GroupsList, setGroupsList] = useState([]);
    const [isGroupListChanged, setIsGroupListChanged] = useState(true);
    const [userGroupListData, setUserGroupListData] = useState([]);
    
    useEffect(() => {
        if (isGroupListChanged) {
            refreshGroupList();
        }
    }, [isGroupListChanged]);
    
    function startAddGroupHandler() {
        setModalIsVisible(true);
    }

    function endAddGroupHandler() {
        setModalIsVisible(false);
        setIsGroupListChanged(true);
    }

    async function AddGroupHandler(groupName) {
        const UserGroupsId = await getUserGroups(currentUserUid);
        const newGroupId = await addGroup(currentUserUid);
        await editGroupName(newGroupId, groupName);
        endAddGroupHandler();
    }

    async function refreshGroupList() {
        const userGroupsId = await getUserGroups(currentUserUid);
        
        if (isGroupListChanged) {
            const tempGroupList = [];
            for (const id of userGroupsId) {
                const group = await getGroupSnapshot(id);
                const nameGroup = group.name;
                tempGroupList.push({ id, nameGroup });
            }
            setUserGroupListData(tempGroupList);
            setIsGroupListChanged(false);
        }
    }

    function handleGroupItemPress(id) {
        setCurrentGroupId(id);
        setCurrentScreen('EditGroup');
    }
    
    if (currentScreen === 'EditGroup') {
        return <GroupItemScreen groupId={currentGroupId} onBack={() => setCurrentScreen('Groups')} />;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <FlatList 
                    data={userGroupListData} 
                    keyExtractor={itemData => itemData.id} 
                    renderItem={({ item }) => (
                        <GroupItem 
                            id={item.id} 
                            nameGroup={item.nameGroup} 
                            onPress={() => handleGroupItemPress(item.id)}
                        />
                    )}
                />
            </View>
            <View style={styles.buttonContainer}>
                <AddRoundButton onPress={startAddGroupHandler} /> 
                <GroupInput visible={ModalIsVisible} onAddGroup={AddGroupHandler} onCancel={endAddGroupHandler} />
            </View>
        </View>
    );
}

export default GroupsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    groupListContainer: {
        flex: 5,
        borderWidth: 1,
        borderColor: 'red'
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red'
    }
});
