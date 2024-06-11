import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, Modal, SafeAreaView} from 'react-native';
import {Title, TransactItem, AddRoundButton, PopUpMenu, InputField} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'react-native-check-box';
import GroupMembersScreen from '../screens/GroupMembersScreen';
import { Transactions1 ,updateTransaction2 } from '../models/transactionsSchema';
import { addBill, getTransactionSnapshot, getLocalTime, deleteBill } from '../models/transactionTest';

import { auth } from '../backend/config';

import { showMessage } from 'react-native-flash-message';
import { getNick } from '../models/test';
import EditTransactModal from '../components/EditTransactModal';
import { minimizeTransactions, removeGroup } from '../models/groupTest';

function GroupItemScreen({ groupObj, onBack }) {
    const [transactList, setTransactList] = useState(null);
    const [tranactListChanged, setTransactListChange] = useState(true);
    const [membersScreenVisible, setMembersScreenVisible] = useState(false);
    const [addTransactModalVisible, setTransactModalVisible] = useState(false);
    const [addTransactFieldsVisible, setAddTransactFieldsVisible] = useState(false);
    const [editTransactDialog, setEditTransactDialog] = useState(false);
    const [editTransactId, setEditTransactId] = useState("");
    const [payerList, setPayerList] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [checkedMembersList,setCheckedMembersList] = useState([]);
    const [transactName,setTransactName] = useState("");
    const [transactPayer,setTransactPayer] = useState("");
    const [transactTotal,setTransactTotal] = useState("");
    const [transactSplitType,setTransactSplitType] = useState(-1);
    const [nameEmptyString,setNameEmptyString] = useState(false);
    const [totalEmptyString,setTotalEmptyString] = useState(false);
    const isMaster = auth.currentUser.uid === groupObj.master;

    async function refreshList(){
        if(!groupObj.transactions){
            return;
        }
        const tempList = [];
        for(const id of Object.keys(groupObj.transactions)){
            const transactObj = await getTransactionSnapshot(id);
            if(transactObj?.title){
                tempList.push({
                    id,
                    title: transactObj.title,
                    total: transactObj.tPayment[0],
                    payer: transactObj.tPayer
                });
            }
        }
        setTransactList(tempList);
    }

    async function renderTrList(){
        if(!groupObj.members) return;
        const tempList = [];
        for(const elem of [...groupObj.members]){
            const nick = await getNick(elem);
            tempList.push({id :elem, nick: nick ?? 'unknown', isChecked: false});
        }
        setMembersList([...tempList]);
    }

    function addTransactionHandler(){
        if(groupObj.members.length === 0){
            showMessage({
                message: "",
                description: "This group has no mebers.\nYou can't make any bills.",
                type: "warning",
                duration: 3000,
                icon: { position: "left", icon: "warning" },
            });
            return;
        }
        (async() => await renderTrList())();
        setTransactModalVisible(true);
    }

    function cancelAddTransaction(){
        setCheckedMembersList([]);
        setTransactModalVisible(false);
        setAddTransactFieldsVisible(false);
    }

    function onCheckNick(item)
    {
        if(!checkedMembersList.includes(item.id)){
            checkedMembersList.push(item.id);
        }else if(item.isChecked && checkedMembersList.length){
            const index = checkedMembersList.indexOf(item.id);
            checkedMembersList.splice(index,1);
        }
    }

    function doneCheckingMembers(){
        if(checkedMembersList.length === 0){
            Alert.alert(
                "Hey!",
                "You need to add members to the group"
            );
            return;
        }
        setPayerList(()=>{
            const tempList = [];
            for(const i of membersList){
                if(i.isChecked)
                    tempList.push({id: i.id, nick: i.nick, isChecked: false});
            }
            return tempList;
        });
        setAddTransactFieldsVisible(true);
    }

    async function createTransactionHandler(){
        const localTime = getLocalTime();
        const billObj = new Transactions1(localTime,groupObj.id,transactPayer,checkedMembersList,transactTotal,"PL",transactSplitType,transactName);
        updateTransaction2(billObj,null);
        
        const res = await addBill(billObj,groupObj.id);
            
        if(res !== undefined){
            setTransactList([...transactList,
                {
                    id: res,
                    title: transactName,
                    total: transactTotal,
                    payer: transactPayer
                }
            ]);
            setAddTransactFieldsVisible(false);
            setMembersScreenVisible(false);
            setTransactModalVisible(false);
            setTransactName("");
            setTransactPayer("");
            setTransactSplitType(-1);
            setTransactTotal(0);
            // setPayerList([]);
        }
    }

    function delTransaction(transactId){
        Alert.alert(
            "Whiping out!",
            "Are you sure you want to delete this bill?\nAll data will be deleted forever.",
            [{
                text: 'Yes', style: "default",
                onPress:
                async()=>{
                    // console.log(transactId);
                    await deleteBill(transactId, groupObj.id);
                    delete groupObj.transactions[transactId];
                    setTransactListChange(true);
                }
             },
             {
                text: 'No', style: 'destructive'
            }]
        );
    }

    function editTransaction(transactId){
        setEditTransactId(transactId);
        setEditTransactDialog(true);
    }

    function onDelGroupHandler(groupId){
        console.log(groupId);
        if(groupObj.active){
            Alert.alert(
                "Hey!",
                "Your group has bills and You can't delete it\n"+
                "Delete all the bills or settle them all"
            );
            return;
        }
        Alert.alert(
            "Wait!",
            "Are You sure You wanna delete the group?",
            [
                {
                    text: "Yes", style: 'default',
                    onPress: async()=>{
                        await removeGroup(auth.currentUser.uid,groupId);
                        setTransactListChange(true);
                        onBack();
                    }
                },
                {text: 'No', style: 'cancel'}
            ]
        );

    }

    function onSettleDeBillHandler(groupId){
        Alert.alert(
            "Wait!",
            "Do You really wanna settle all bills?\n"+
            "The group will be deleted and all members\n"+
            "will be notified about debts.",
            [
                {
                    text: 'Yes', style: 'default',
                    onPress:  async()=>{
                        await minimizeTransactions(groupId);
                        removeGroup(auth.currentUser.uid, groupId);
                        onBack();
                        // email broadcast
                        // delete group funcs
                    }
                },
                {text: 'No', style: 'cancel'}
            ]
        );
    }
    
    if(tranactListChanged){
       (async()=>await refreshList())();
        setTransactListChange(false);
    }

    return (
        (!membersScreenVisible) ?
        <View style={styles.container}>
            <View style={styles.groupTitleBlock}>
                <View style={styles.topButtons}>
                    <Icon onPress={onBack}
                        name="arrow-left"
                        size={30}
                    />
                    <PopUpMenu
                        masterUid={groupObj.master}
                        onMembersPress={()=>setMembersScreenVisible(true)}
                        onDelGroupPress={()=>onDelGroupHandler(groupObj.id)}
                        onSettleGroup={()=>onSettleDeBillHandler(groupObj.id)}
                    />
                </View>
                <View style={styles.groupInfo}>
                    <Title>{groupObj.name}</Title>
                </View>
                <View style={styles.transactListView}>
                    <FlatList centerContent={true}
                        ListEmptyComponent={
                            <Text style={styles.emptyListText}>
                                There are no bills yet...
                            </Text>
                        }
                        
                        data={transactList}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => {
                            const trTitle = item.title;
                            return (
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{justifyContent:'flex-start'}}>
                                        <Text style={{fontSize: 22}}>{trTitle}</Text>
                                        <Text style={{fontSize: 22}}>{"total: "+item.total}</Text>
                                    </View>
                                    {/* {item.payer === auth.currentUser.uid&& */}
                                    <View style={{flexDirection: 'row', marginLeft: 20}}>
                                        <Icon name='playlist-edit' size={30} onPress={()=>editTransaction(item.id)}/>
                                        <Icon name='delete-forever' size={30} onPress={(item)=>delTransaction(item.id)}/>
                                    </View>
                                </View>
                            );
                        }}
                    >
                    </FlatList>
                    {editTransactDialog&&
                        <EditTransactModal
                            visible={editTransactDialog} 
                            members={groupObj.members}
                            transactId={editTransactId}
                            setVisible={(val)=>setEditTransactDialog(val)} 
                            setTransactChanged={()=>setTransactListChange(true)}
                        />
                    }
                </View>
                <View style={styles.bottomNavView}>
                    <AddRoundButton onPress={addTransactionHandler}/>
                </View>
                <Modal transparent={false} visible={addTransactModalVisible} presentationStyle='fullScreen'>
                    <SafeAreaView>
                    <View style={{ backgroundColor: 'white', marginTop: 30, marginHorizontal: 10, }}>
                            { !addTransactFieldsVisible &&
                            <>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Icon name="chevron-left" size={24} onPress={cancelAddTransaction}/>
                                    <Button title="Done" onPress={doneCheckingMembers}/>
                                </View>
                                <FlatList
                                    data={membersList}
                                    keyExtractor={item => item.id}
                                    renderItem={({item})=>{
                                        return(
                                        <View style={{marginHorizontal: 50}}>
                                            <CheckBox
                                                leftText={item.id===auth.currentUser.uid?'Me':item.nick}
                                                leftTextStyle={{
                                                    fontSize: 22,
                                                    margin: 10,
                                                    color: item.isChecked?'green': 'black'
                                                }}
                                                isChecked={item.isChecked}
                                                onClick={()=>{
                                                    onCheckNick(item);
                                                    setMembersList((currList)=> {
                                                        for(const i of currList){
                                                            if(i.id === item.id)
                                                                i.isChecked = !i.isChecked;
                                                        }
                                                        return [...currList];
                                                    });
                                                }}
                                            /> 
                                        </View>);
                                    }}
                                />
                            </>}
                            { addTransactFieldsVisible &&
                                <View style={{}}>
                                    <Icon name="chevron-left" size={30} onPress={()=>setAddTransactFieldsVisible(false)}/>
                                    <View style={{marginTop: 30, marginHorizontal: 10}}>
                                        <InputField 
                                            value={transactName}
                                            fieldName="Bill name"
                                            emptyString= {nameEmptyString}
                                            onChangeText={(curr)=>{
                                                setNameEmptyString(curr.trim().length === 0);
                                                setTransactName(curr);
                                            }}
                                        />
                                        <InputField
                                            value={transactTotal}
                                            fieldName="Total"
                                            emptyString={totalEmptyString}
                                            onChangeText={(curr)=>{
                                                setTotalEmptyString(curr.trim().length === 0);
                                                const comaIndex = curr.indexOf(",");
                                                if(comaIndex !== -1 && curr.substring(comaIndex+1).length > 2){
                                                    setTotalEmptyString(true);
                                                    return;
                                                }
                                                const normalized = curr.replace(",",".");
                                                const num = Number(normalized);
                                            
                                                if(isNaN(num))
                                                {
                                                    setTotalEmptyString(true);
                                                    return;
                                                }
                                                setTransactTotal(num);
                                            }} 
                                            keyboardType="decimal-pad"
                                        />
                                        <View style={{justifyContent: 'flex-start', marginVertical: 20}}>
                                            <Text style={{marginRight: 40, fontSize: 22}}>Payer</Text>
                                            <FlatList style={{borderWidth: 1, borderColor: '#212121', borderRadius: 8, marginTop: 5}}
                                                data={payerList}
                                                keyExtractor={item => item.id}
                                                renderItem={({item})=>{
                                                    return(
                                                        <View style={{}}>
                                                        <CheckBox
                                                            leftText={item.id===auth.currentUser.uid?'Me':item.nick}
                                                            leftTextStyle={{
                                                                fontSize: 22,
                                                                margin: 10,
                                                                color: item.isChecked?'green': 'black'
                                                            }}
                                                            isChecked={item.isChecked}
                                                            onClick={()=>{
                                                                setTransactPayer(item.id);
                                                                setPayerList((currList)=> {
                                                                    for(const i of currList){
                                                                        if(i.isChecked)
                                                                            i.isChecked = false;
                                                                        if(i.id === item.id)
                                                                            item.isChecked = true;
                                                                    }
                                                                    return [...currList];
                                                                });
                                                            }}
                                                            /> 
                                                    </View>);
                                                }}
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <Text style={{fontSize: 22}}>Split Type</Text>
                                            <Button title='even' size={22} onPress={()=>setTransactSplitType(0)}/>
                                            <Button title='custom' size={22} onPress={()=>setTransactSplitType(1)}/>
                                        </View>
                                    </View>
                                    <View>
                                        <Button title='Confirm' disabled={totalEmptyString || nameEmptyString || transactSplitType === -1 || transactPayer.length === 0}
                                            onPress={async()=>await createTransactionHandler()}
                                        />
                                    </View>
                                </View>
                            }
                    </View>
                    </SafeAreaView>
                </Modal>
            </View>
        </View>
        : <GroupMembersScreen
            groupObj={groupObj}
            onBack={()=>setMembersScreenVisible(false)}
            isMaster={isMaster}
            />
    );
}

export default GroupItemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupTitleBlock: {
        flex: 1,
    },
    topButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    groupInfo: {
        alignItems: 'center',
        margin: 10,
        borderRadius: 16,
        backgroundColor: 'purple'
    },
    transactListView: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        borderRadius: 16,
        backgroundColor: 'purple'
    },
    bottomNavView: {
        alignItems: 'center',
        padding: 10,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginBottom: 24,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#ccccccc',
    //     backgroundColor: 'red'
    // },
    // groupTitleBlock: {
    //     flex:1,
    //     // justifyContent: 'space-between',
    //     // alignContent: 'space-between',
    //     // marginHorizontal: 15,
    //     width: 428,
    //     backgroundColor: '#ab74cf',
    //     // borderColor: 'red',
    //     // borderWidth: 1,
    // },
    // topButtons: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     // marginHorizontal: 5,
    //     marginTop: 10,
    //     marginHorizontal: 5,
    //     maxHeight: 32,
    //     // borderColor: 'red',
    //     // borderWidth: 1,
    // },
    // groupInfo: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     margin: 10,
    //     maxHeight: 200,
    //     borderRadius: 16,
    //     backgroundColor: "#7153ac",
    //     // borderWidth: 1,
    //     // borderColor: 'red',
    // },
    // transactListView: {
    //     flex: 4,
    //     justifyContent: "center",
    //     alignItems: 'center',
    //     backgroundColor: "#7153ac",
    //     marginHorizontal: 10,
    //     borderRadius: 16,
    //     borderWidth: 1,
    //     borderColor: 'red',
    // },
    // bottomNavView: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     alignItems: 'center',
    //     margin: 10,
    //     borderWidth: 1,
    //     borderColor: 'red',
    // },
    // emptyListText: {
    //     marginTop: '50%',
    //     fontSize: 24,
    //     color: 'white'
    // },
    // modalContainer: {
    //     flex: 1,
    //     borderRadius: 16,
    //     backgroundColor: 'rgba(0,0,0,0.5)'
    // }
});
