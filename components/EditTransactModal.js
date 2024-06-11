import React, {useState} from "react";

import {Text, View, Alert, StyleSheet, SafeAreaView, Modal, Button} from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getNick, auth, findUserByUid } from "../models/test";
import InputField from "./InputField";
import { addMemberToAccount, deleteMemberFromAccount, getTransactionSnapshot, splitTotalBetweenMembers } from "../models/transactionTest";
import FriendsChecklist from "./FriendsChecklist";
import CheckBox from "react-native-check-box";
import { NavigationHelpersContext } from "@react-navigation/native";

export default function EditTransactModal({transactId, visible, setVisible, members, setTransactChanged}){
    const [changeSplitTypeVisible,setChangeSplitTypeVisible] = useState(false);
    const [addMemberVisible, setAddMemberVisible] = useState(false);
    const [renderOnce, setRenderOnce] = useState(true);
    const [renderDelMembersOnce, setRenderDelMembersOnce] = useState(true);
    const [addMemberList, setAddMembersList] = useState([]);
    const [delMemberList, setDelMembersList] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [delMemberVisible, setDelMemberVisible] = useState(false);
    const [splitType, setSplitType]  = useState(0);
    const [payerVal, setPayerVal] = useState(0);
    const [splitTypeValCaution, setSplitTypeValCaution] = useState(true);
    const [payersList, setPayersList] = useState([]);
    const [payersListChanged,setPayerListChanged] = useState(false);

    async function renderList(){
        const transactObj = await getTransactionSnapshot(transactId);
        const tempList = [];
        for(const [id, val] of Object.entries(transactObj.tAccount)){
            const nick = await getNick(id);
            if(nick !== null){
                tempList.push({nick, id, val, total: transactObj.tPayment[0]});
            }
        }
        setPayersList([...tempList]);
    }

    async function renderAddMemberList(){
        const tempList = [];
        for(const elem of members){
            const nick = await getNick(elem);
            if(nick)
                tempList.push({id :elem, nick, isChecked: false});
        }
        setAddMembersList([...tempList]);
    }

    async function renderDelMemberList(){
        const tempList = [];
        const trObj = await getTransactionSnapshot(transactId);
        for(const elem of Object.keys(trObj.tAccount)){
            const nick = await getNick(elem);
            tempList.push({id: elem, nick});
        }
        setDelMembersList([...tempList]);
    }

    // function closeMainModal(){
    //     setVisible(false);
    // }

    function addMemberHandler(){
        if(renderOnce){
            (async()=>await renderAddMemberList())();
            setRenderOnce(false);
        }
        setAddMemberVisible(true);
        setTransactChanged(true);
    }

    function delMemberHandler(){
        if(renderDelMembersOnce){
            (async()=>await renderDelMemberList())();
            setRenderDelMembersOnce(false);
        }
        setDelMemberVisible(true);
    }

    function onCheck(member){
        if(!checkedList.includes(member.id)){
            checkedList.push(member.id);
        }
        else if(member.isChecked && checkedList.length){
            const index = checkedList.indexOf(member.id);
            checkedList.splice(index,1);
        }
        setCheckedList([...checkedList]);
    }

    async function onDoneAdMembersHandler(){
        if(!checkedList.length){
            Alert.alert('Hey!','You shoud choose someone!');
            return;
        }
        
        const trObj = {...await getTransactionSnapshot(transactId), id: transactId};
        for(const uid of Object.keys(trObj.tAccount)){
            if(checkedList.includes(uid)){
                Alert.alert("Woops(0_0)", "Some user is already in the bill");
                return;
            }
        }
        for(const uid of checkedList){
            await addMemberToAccount(transactId,uid);
        }
        await splitTotalBetweenMembers(transactId);
        setRenderOnce(true);
        setAddMemberVisible(false);
        setTransactChanged(true);
    }

    function onDeleteMember(memberId){
        (async()=>{
            await deleteMemberFromAccount(transactId, memberId);
            await splitTotalBetweenMembers(transactId);
            await renderDelMemberList();
            setTransactChanged(true);
        })();
    }

    function onDoneDelMembers(){
        setDelMemberVisible(false);
        setRenderDelMembersOnce(true);
    }

    function onChangeSplitType(){
        (async()=>await renderList())();
        setChangeSplitTypeVisible(true)
    }

    function onDoneChangeSplitType(){
        setChangeSplitTypeVisible(false);
    }

    return(
        <>
        <Modal transparent visible={visible}>
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.modalView}>
                    {!(addMemberVisible&&delMemberVisible)&&<>
                    <Button title="Add a member" onPress={addMemberHandler}/>
                    <Button title="Delete a member"onPress={delMemberHandler}/>
                    <Button title="Change split type" onPress={onChangeSplitType}/>
                    </>}
                    {(addMemberVisible||delMemberVisible||changeSplitTypeVisible)&&
                    <Modal transparent visible={addMemberVisible||delMemberVisible||changeSplitTypeVisible}>
                        <SafeAreaView style={{flex:1}}>
                        <View style={[styles.innerModalView, {height: changeSplitTypeVisible?170:152}]}>
                            {addMemberVisible &&
                            <>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Icon name="chevron-left" size={30} onPress={()=>{setAddMemberVisible(false);}}/>
                                    <Button title="Done" onPress={onDoneAdMembersHandler}/>
                                </View>
                                <FlatList style={{marginHorizontal: 40}}
                                    data={addMemberList}
                                    keyExtractor={item=>item.id}
                                    renderItem={({item})=>{
                                        return(
                                            <CheckBox isChecked={item.isChecked}
                                                leftText={item.nick}
                                                leftTextStyle={{fontSize: 22, marginBottom: 20}}
                                                onClick={()=>{
                                                    onCheck(item);
                                                    setAddMembersList((currList)=>{
                                                        for(const i of currList){
                                                            if(i.id === item.id)
                                                                i.isChecked = !i.isChecked;
                                                        }
                                                        return [...currList];
                                                    });
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </>
                            }
                            {delMemberVisible &&
                            <>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Icon name='chevron-left' size={30} onPress={()=>setDelMemberVisible(false)}/>
                                    <Button title='Done' onPress={onDoneDelMembers}/>
                                </View>
                                <FlatList
                                    data={delMemberList}
                                    keyExtractor={item=>item.id}
                                    renderItem={({item})=>{
                                        return (
                                            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 20}}>
                                                <Text style={{fontSize: 22}}>{item.nick}</Text>
                                                <Icon name="delete-forever" size={30} color='red' onPress={()=>{onDeleteMember(item.id);}}/>
                                            </View>
                                        );
                                    }}
                                />
                            </>}
                            {changeSplitTypeVisible&&
                            <>
                                <Icon name="chevron-left" size={30} onPress={()=>{setChangeSplitTypeVisible(false);}}/>
                                <FlatList style={{borderColor: 'red', borderWidth: 1}}
                                    ListEmptyComponent={()=>
                                        <Text style={{textAlign:'center'}}>There are no payers</Text>
                                    }
                                    data={payersList}
                                    keyExtractor={item => item.id}
                                    renderItem={({item})=>
                                        <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal:15, marginBottom: 10}}>
                                            <Text style={{fontSize: 22}}>{item.nick}</Text>
                                            <InputField minLength={200}
                                                value={item.val}
                                                placeholder={"value"}
                                                keyboardType="numeric"
                                                onChangeText={(text) => {
                                                    setSplitTypeValCaution(text.trim().length===0);
                                                    console.log("total",item.total);
                                                    const newData = payersList.map((obj) => {
                                                        
                                                        return obj.id === item.id
                                                        ? { ...obj, val: Number(text) }
                                                        : obj;
                                                    });
                                                    setPayersList(newData);
                                                    for(const obj of payersList){
                                                        setSplitTypeValCaution(item.val+obj.val>item.total||obj.val>item.total);
                                                    }
                                                }}
                                            />
                                        </View>
                                    }
                                />
                                <Button title="Done" onPress={onDoneChangeSplitType} disabled={splitTypeValCaution}/>
                            </>}
                        </View>
                        </SafeAreaView>
                    </Modal>}
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Button title="Cancel" onPress={()=>setVisible(false)}/>
                    </View>
                </View>
                    
            </SafeAreaView>
        </Modal>
        {/* <View style={{flexDirection: 'row'}}> */}
            
        {/* </View> */}
        </>
    );
}

const styles = StyleSheet.create({
    modalView: {
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        width: 300,
        top: '50%',
        right: '14%',
        flex: 3,
        // height: 300,
        // justifyContent: 'center',
        // borderColor: 'red', borderWidth: 1
    },
    innerModalView: {
        // marginVertical: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
        // flex: 1,
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        width: 400,
        
        top: '50%',
        right: 14,
    }
});