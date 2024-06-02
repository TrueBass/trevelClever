import { useRef, useState } from "react";
import {
    View,
    Text,
    Modal,
    Alert,
    Animated,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Easing,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { auth } from "../backend/config";

export default function PopUpMenu({masterUid, onMembersPress, onDelGroupPress = null}){
    const [visible, setVisible] = useState(false);
    const options={
        members: {
            title: "Members",
            icon: "account-group",
            action: () => onMembersPress()
        },
        delGroup: {
            title: "Delete group",
            icon: "delete-forever-outline",
            color: 'red',
            action: onDelGroupPress
        }
    };

    const scale = useRef(new Animated.Value(0)).current;

    function resizeBox(to){
        to === 1 && setVisible(true);
        Animated.timing(scale,
            {
                toValue: to,
                useNativeDriver: true,
                duration: 100,
                easing: Easing.linear
        }).start(() => to === 0 && setVisible(false));
    }

    return(
        <>
            <TouchableOpacity onPress={()=>resizeBox(1)}>
                <Icon name="format-list-bulleted" size={30} color={"#212121"}/>
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView style={{flex: 1}} onTouchEnd={()=>resizeBox(0)}>
                    <Animated.View style={[styles.popup,{transform: [{scale}]}]}>
                        <TouchableOpacity onPress={options.members.action}
                            style={[styles.option, {borderBottomWidth: 1}]}
                        >
                            <Text>{options.members.title}</Text>
                            <Icon name={options.members.icon}
                                size={26} color={"#212121"}
                            />
                        </TouchableOpacity>
                        {auth.currentUser.uid == masterUid &&
                            <TouchableOpacity style={styles.option}
                                onPress={options.delGroup.action}
                            >
                                <Text>{options.delGroup.title}</Text>
                                <Icon name={options.delGroup.icon}
                                    size={26} color={options.delGroup.color}
                                />
                            </TouchableOpacity>
                        }
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 105,
        right: 35
    },
    option: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderColor: '#ccc'
    }
});
