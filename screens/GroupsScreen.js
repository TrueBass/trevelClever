import { React, useState } from "react";
import {View,StyleSheet,FlatList,TouchableOpacity,Modal} from "react-native";
import GroupItem from "../components/GroupItem";
import AddRoundButton from '../components/AddRoundButton';
import GroupInput from "../components/GroupInput";
import { auth } from '../backend/config';
import {addGroup,getUserGroups, getGroupSnapshot,editGroup, editGroupName} from '../models/groupTest';
import Groups from "../models/groupsSchema"

function GroupsScreen(){
    const[currentUserUid, setCurrentUserUid] = useState(auth.currentUser.uid);
    const[ModalIsVisible,setModalIsVisible] = useState(false);
    const[GroupsList,setGroupsList] = useState([]);
    const[isGroupListChanged, setIsGroupListChanged] = useState(true);
    const[userGroupListData,setUserGroupListData] = useState([]);
    
    function startAddGroupHandler(){
        setModalIsVisible(true);
    }

    function endAddGroupHandler(){
        setModalIsVisible(false);
        setIsGroupListChanged(true);
    }
    
    async function AddGroupHandler(groupName) {
        const UserGroupsId = await getUserGroups(currentUserUid);
        const newGroupId = await addGroup(currentUserUid);
        await editGroupName(newGroupId,groupName);
        //console.log("UserGroupsId:\n",UserGroupsId,"\nnewGroup:\n",newGroupObj);
        //setGroupsList(currentGroups => [...currentGroups, { text: groupName, id: Math.random().toString() }]);
       
        endAddGroupHandler();
      }

    async function refreshGroupList(){
        const userGroupsTemp = await getUserGroups(currentUserUid);
        const userGroupsId = [...new Set(userGroupsTemp)];
        
        if(isGroupListChanged){
            const tempGroupList = [];
            

            for(const id of userGroupsId){
                console.log(id);
                const group = await getGroupSnapshot(id);
                const nameGroup = group.name;
                tempGroupList.push({id,nameGroup});
            }

            setUserGroupListData(tempGroupList);
            setIsGroupListChanged(false);
        }
        
    }
    
    if(isGroupListChanged){
        refreshGroupList();
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <FlatList data={userGroupListData} keyExtractor={itemData => itemData.id} 
                renderItem={(itemData) => {
                    return <GroupItem nameGroup={itemData.nameGroup}/>;
                }}/>
            </View>
            
            <View style={styles.buttonContainer}>
                <AddRoundButton onPress={startAddGroupHandler}/> 
                <GroupInput visible={ModalIsVisible} onAddGroup={AddGroupHandler} onCancel={endAddGroupHandler}/>
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
groupListContainer:{
    flex:5,
    borderWidth:1,
    borderColor: 'red'
},

buttonContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor: 'red'
}

});