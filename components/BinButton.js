import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { removeFriend } from '../models/test'

export default function BinButton({friendId}){

    async function removeFriendHandler(){
        await removeFriend(friendId);
    }

    return (<View>
        <Pressable onPress={removeFriendHandler}>
            <MaterialCommunityIcons name="delete-forever-outline"
                size={24} color="black"
            />
        </Pressable>
    </View>);
}