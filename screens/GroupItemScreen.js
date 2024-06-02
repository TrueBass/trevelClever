import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, Modal} from 'react-native';
import {Title, TransactItem, AddRoundButton, PopUpMenu} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'react-native-check-box';
import GroupMembersScreen from '../screens/GroupMembersScreen';

import { auth } from '../backend/config';

import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNick } from '../models/test';

function GroupItemScreen({ groupObj, onBack }) {
    const [tranactList, setTransactList] = useState(null);
    const [tranactListChanged, setTransactListChange] = useState(true);
    const [membersScreenVisible, setMembersScreenVisible] = useState(false);
    const [addTransactModalVisible, setTransactModalVisible] = useState(false);
    const [membersList, setMembersList] = useState([]);
    const isMaster = auth.currentUser.uid === groupObj.master;

    function refreshList(){
        if(!groupObj.transactions)
            return;
        const tempList = [];
        let index = 0;
        for(const id of groupObj.transactions){
            tempList.push({index, id});
            index++;
        }

        setTransactList(tempList);
        setTransactListChange(true);
    }

    async function renderTrList(){
        let id = 0;
        const tempList = [];
        for(const elem of groupObj.members){
            const nick = await getNick(elem);
            tempList.push({id, nick, isChecked: false});
            id++;
        }
        setMembersList([...tempList]);
    }

    function addTransactionHandler(){
        if(groupObj.members.length === 0){
            showMessage({
                message: "",
                description: "This group iss empty.\nYou can't make any debts.",
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
        setTransactModalVisible(false);
    }

    if(tranactListChanged){
        refreshList();
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
                    />
                </View>
                <View style={styles.groupInfo}>
                    <Title>{groupObj.name}</Title>
                </View>
                <View style={styles.transactListView}>
                    <FlatList
                        ListEmptyComponent={
                            <Text style={styles.emptyListText}>
                                There are no debts yet...
                            </Text>
                        }
                        
                        data={tranactList}
                        keyExtractor={item => item.index}
                        renderItem={({item}) => 
                            <Text style={{fontSize: 32}}>{item.id}</Text>
                        }
                    >
                    </FlatList>
                    
                </View>
                <View style={styles.bottomNavView}>
                    <AddRoundButton onPress={addTransactionHandler}/>
                </View>
            </View>
            <Modal transparent visible={addTransactModalVisible}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={{top: 455, height: 300, margin: 10, paddingHorizontal: 8,}}>
                        <Icon name="chevron-left" size={24} onPress={cancelAddTransaction}/>
                        <FlatList
                            data={membersList}
                            keyExtractor={item => item.id}
                            renderItem={({item})=>{
                                return(
                                <View style={styles.checkBoxView}>
                                    <CheckBox
                                        leftText={item.nick}
                                        leftTextStyle={{
                                            fontSize: 22, textAlign: 'center',
                                            color: item.isChecked?'green': 'black'
                                        }}
                                        isChecked={item.isChecked}
                                        onClick={()=>{
                                            onCheckNick(item);
                                            setNicknamesList((currList)=> {
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
                    </View>
                </SafeAreaView>
            </Modal>
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
