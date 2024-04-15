import { useState } from "react";
import{View,Button, TextInput,StyleSheet,Modal} from "react-native";

function GroupInput(props){
    const[NameGroup, setNameGroup] = useState('');

    function GroupInputHandler(enteredText){
        setNameGroup(enteredText);
    }

    function AddGroupHandler(){
        props.onAddGroup(NameGroup);
        setNameGroup('');
    }

    return(
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Your group name" onChangeText={GroupInputHandler}/>
                <View style={styles.buttonContainer}>
                    <Button title="Confirm" onPress={AddGroupHandler}/>
                    <Button title="Cancel" onPress={props.onCancel}/>
                </View>
            </View>
        </Modal>
    );
};

export default GroupInput;

const styles = StyleSheet.create({
inputContainer:{
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccccccc'
},
textInput:{
    borderWidth:1,
    borderColor: '#7c7c7c',
    width: '70%',
    marginRight: 8,
    padding: 8
},
buttonContainer:
{
    flexDirection:"row",
    justifyContent: "space-between"
}
});