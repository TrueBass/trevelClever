import { React, useState } from "react";
import {View,Text,StyleSheet,FlatList,Button} from "react-native";
import AddRoundButton from '../components/AddRoundButton';

function GroupsScreen(){
    return(
        <View style={styles.container}>
            <View style={styles.groupListContainer}>
                <Text>Gfgfgfg</Text>
            </View>
            <View style={styles.buttonContainer}>
                <AddRoundButton/>
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