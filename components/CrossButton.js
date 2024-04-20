import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { removeFriend } from '../models/test'

export default function CrossButton({onRemove=null, currentUserId, friendId}){

    async function removeFriendHandler(){
        await removeFriend(currentUserId,friendId);
        onRemove && onRemove(true);
    }

    return (<View>
        <Pressable onPress={removeFriendHandler}>
            <MaterialIcons name="highlight-remove"
                size={35} color="#df2e2eff"
            />
        </Pressable>
    </View>);
}