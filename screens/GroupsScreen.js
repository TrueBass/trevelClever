import { React, useState } from "react";
import {View,Text,StyleSheet,FlatList} from "react-native";
import GroupItem from "../components/GroupItem";
import AddRoundButton from '../components/AddRoundButton';

function GroupsScreen(){
    const[Groups,setGroups] = useState([]);
    texct = 'hhh'
    function AddGroupHandler(){
        setGroups(currentAddingGroup => [...currentAddingGroup,{text: texct,key:Math.random().toString()}]);
        console.log("....");
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <FlatList data={Groups} renderItem={(itemData) => {
                    return <GroupItem text={itemData.text}/>;
                }}/>
            </View>
            
            <View style={styles.buttonContainer}>
                <AddRoundButton onPress={AddGroupHandler}/>
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