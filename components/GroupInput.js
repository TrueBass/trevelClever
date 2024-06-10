import { useState } from "react";
import {
    View,
    Button,
    TextInput, 
    StyleSheet,
    Modal,
    SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import InputField from './InputField';
import FriendsChecklist from "./FriendsChecklist";

function GroupInput(props){
    const [NameGroup, setNameGroup] = useState('');
    const [emptyStrigCaution, setEmptyStringCaution] = useState(false);
    const [checkedNicksList, setCheckedNicksList] = useState([]);
    const [visible, setVisible] = useState(true);
    const [friendsToAddCheckDone, setFriendsToAddCheckDone] = useState(false);

    function GroupInputHandler(enteredText){
        setEmptyStringCaution(enteredText.trim().length === 0);
        if(enteredText.length > 25 && enteredText.length < 1)
            setEmptyStringCaution(true); 
        setNameGroup(enteredText);
    }

    function AddGroupHandler(){
        props.onAddGroup(NameGroup);
        setNameGroup('');
    }

    function pushCheckedFriend(idList){

        setCheckedNicksList([...idList]);
    }

    function doneChoosingFriends(val){
        if(checkedNicksList.length > 0)
            {
                setVisible(!val);
                setFriendsToAddCheckDone(val);
            }
        
    }

    return(
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.inputContainer}>
                <SafeAreaView style={{flex: 1}}>
                    {   !friendsToAddCheckDone &&
                        <View style={styles.friendsFlatlist}>
                            <FriendsChecklist type="group"
                                visibleProp={visible}
                                setVisibleProp={null}
                                checkedList={checkedNicksList}
                                onCheck={pushCheckedFriend}
                                onDone={()=>doneChoosingFriends(true)}
                                onCancel={()=>{setCheckedNicksList([]); props.onCancel();}}
                            />
                        </View>
                    }
                    {   friendsToAddCheckDone &&
                            <View style={styles.inputFieldsContainer}>
                                <InputField
                                    value={NameGroup}
                                    fieldName="Group name"
                                    placeholder="Your group name"
                                    onChangeText={(curr)=>
                                        GroupInputHandler(curr)
                                    }
                                    emptyString={emptyStrigCaution}
                                />
                            </View>
                    }
                    <View style={styles.buttonContainer}>
                        {   friendsToAddCheckDone&&
                            <Button disabled={emptyStrigCaution} title="Confirm" onPress={AddGroupHandler}/>}
                        {   friendsToAddCheckDone&&
                            <Button title="Cancel"
                                onPress={()=>{
                                    setCheckedNicksList([]);
                                    doneChoosingFriends(false);
                                    props.onCancel();
                            }}/>
                        }
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default GroupInput;

const styles = StyleSheet.create({
    inputContainer:{
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccccccc',
        // backgroundColor: 'grey'
    },
    inputFieldsContainer:{
        flex: 4,
        top: 300,
        // marginRight: 8,
        // padding: 8
    },
    buttonContainer:
    {
        flex: 1,
        flexDirection:"row",
        justifyContent: "space-evenly",
    },
    friendsFlatlist: {
        flex: 4,
        alignItems: 'flex-end'
    }
});