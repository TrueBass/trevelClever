import React, {useState} from "react";

import {Text, View, Alert, StyleSheet, SafeAreaView, Modal, Button} from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getNick } from "../models/test";
import InputField from "./InputField";
import { getTransactionSnapshot } from "../models/transactionTest";

export default function EditTransactModal({transactId, visible, setVisible}){
    const [changeSplitTypeVisible,setChangeSplitTypeVisible] = useState(false);
    const [splitType, setSplitType]  = useState(0);
    const [payerVal, setPayerVal] = useState(0);
    const [payersList, setPayersList] = useState([]);
    const [payersListChanged,setPayerListChanged] = useState(false);

    async function renderList(){
        const transactObj = await getTransactionSnapshot(transactId);
        console.log(transactObj);
        const tempList = [];
        for(const [id, val] of Object.entries(transactObj.tAccount)){
            const nick = await getNick(id);
            if(nick !== null){
                tempList.push({nick, id, val});
            }
        }
        setPayersList([...tempList]);
    }

    if(payersListChanged){
        (async()=>await renderList());
        setPayerListChanged(false);
    }

    return(
        <>
        <Modal transparent visible={visible}>
            <SafeAreaView style={{flex: 1}} onTouchEnd={()=>setVisible(false)}>
                <View style={styles.modalView}>
                    <Button title="Add a member"/>
                    <Button title="Delete a member"/>
                    <Button title="Change split type" onPress={()=>setChangeSplitTypeVisible(true)}/>
                    <View style={{flexDirection: 'row'}}>
                        {/* <Modal visible={changeSplitTypeVisible}>
                            <SafeAreaView style={{flex:1}}>
                            <View style={styles.innerModalView}>
                                
                                <FlatList
                                    data={payersList}
                                    keyExtractor={item=> item.id}
                                    renderItem={({item})=>{
                                        return(
                                            <View>
                                                <Text>{item.nick}</Text>
                                                <InputField value={item.val}
                                                    keyboardType="numeric"
                                                    onChangeText={(curr)=>{
                                                        setPayerListChanged(
                                                            (currList)=>{
                                                                for(const i of currList){
                                                                    if(i.id === item.id)
                                                                        i.val = Number(curr.toFixed(2));
                                                                }
                                                            }
                                                        );
                                                    }}
                                                />
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                            </SafeAreaView>
                        </Modal> */}
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
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
        top: '50%',
        right: 10
    },
    innerModalView: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});