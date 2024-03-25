import { React, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function FriendsScreen(){
    const [friendNickname, setFriendNickname] = useState('');
    
    return (
        <View>
            <InputField
                onChangeText={(text)=>setFriendNickname(text)}
                placeholder={"input friend's nickname"}
                value={friendNickname}
            />
        </View>
    );
}

// const styles = StyleSheet.create({

// });