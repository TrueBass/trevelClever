import { React, useState } from "react";
import {View,StyleSheet,FlatList} from "react-native";
import GroupItem from "../components/GroupItem";
import AddRoundButton from '../components/AddRoundButton';
import GroupInput from "../components/GroupInput";

function GroupsScreen(){
    const [ModalIsVisible,setModalIsVisible] = useState(false);
    const[Groups,setGroups] = useState([]);

    function startAddGroupHandler(){
        setModalIsVisible(true);
    }

    function endAddGroupHandler(){
        setModalIsVisible(false);
    }
    
    function AddGroupHandler(NameGroup){
        setGroups(currentAddingGroup => [...currentAddingGroup,{text:NameGroup ,key:Math.random().toString()}]);
        //console.log("....");
        endAddGroupHandler();
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <FlatList data={Groups} renderItem={(itemData) => {
                    return <GroupItem text={itemData.text}/>;
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