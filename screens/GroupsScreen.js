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
    const [currentGroupObj, setCurrentGroupObj] = useState(null);
    const [currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const [ModalIsVisible, setModalIsVisible] = useState(false);
    const [isGroupListChanged, setIsGroupListChanged] = useState(true);
    const [userGroupListData, setUserGroupListData] = useState([]);

    function startAddGroupHandler() {
        setModalIsVisible(true);
    }

    function endAddGroupHandler() {
        setModalIsVisible(false);
        refreshGroupList();
    }

    async function AddGroupHandler(groupName) {
        const newGroupId = await addGroup(currentUserUid);
        await editGroupName(newGroupId, groupName);
        endAddGroupHandler();
    }

    async function refreshGroupList() {
        const userGroupsId = await getUserGroups(currentUserUid);

        const tempGroupList = [];
        for (const id of userGroupsId) {
            const group = await getGroupSnapshot(id);
            tempGroupList.push({id, group});
        }
        setUserGroupListData(tempGroupList);
    }

    function handleGroupItemPress(id, group) {
        group.id = id;
        setCurrentGroupObj(group);
        setCurrentScreen('EditGroup');
    }

    if (currentScreen === 'EditGroup') {
        return <GroupItemScreen
                groupObj={currentGroupObj}
                onBack={() =>{ 
                    setIsGroupListChanged(true);
                    setCurrentScreen('Groups');
                }} 
            />;
    }

    if (isGroupListChanged) {
        refreshGroupList();
        setIsGroupListChanged(false);
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <FlatList
                    data={userGroupListData} 
                    keyExtractor={itemData => itemData.id} 
                    renderItem={({ item }) =>
                        <GroupItem 
                            id={item.id}
                            nameGroup={item.group.name}
                            onPress={() => handleGroupItemPress(item.id, item.group)}
                        />
                    }
                />
            </View>
            <View style={styles.buttonContainer}>
                <AddRoundButton onPress={startAddGroupHandler} /> 
                <GroupInput visible={ModalIsVisible} onAddGroup={AddGroupHandler} onCancel={() => setModalIsVisible(false)} />
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
        // flex: 5,
        borderWidth: 1,
        borderColor: 'red',
        flex: 5,
        justifyContent: 'center',
        alignItems: 'stretch',
        // marginVertical: 10,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red'
    }
});
