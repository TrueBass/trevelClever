import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { removeFriend } from '../models/test'

export default function CrossButton({onRemove=null, currentUserId, friendId}){

    async function removeFriendHandler(){
        await removeFriend(currentUserId,friendId);
        onRemove && onRemove(true);
    }

    return (<View>
        <Pressable onPress={removeFriendHandler}>
            <Icon name="trash-can-outline"
                size={35} color="#df2e2eff"
            />
        </Pressable>
    </View>);
}