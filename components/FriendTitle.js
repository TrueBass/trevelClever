import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import BinButton from "./BinButton";

export default function FriendTitle({friendId, nickname, profilePhoto = null }) {

    return (
        <View style={styles.backGround}>
            <View style={styles.image}>
                {
                    profilePhoto // if profilePhoto is null - use simple icon
                        ? <Image source={{ uri: profilePhoto }} style={{ width: 100, height: 100 }} />
                        : <FontAwesome5 name="user-alt" size={100} color="black" />
                }
            </View>
            <View style={styles.text}>
                <Text style={{ fontSize: 20 }}>{nickname}</Text>
            </View>
            <BinButton friendId={friendId}/>
        </View>
    );
}

const styles = StyleSheet.create({

    backGround: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        backgroundColor: '#bc86d7ff',
        borderRadius: 50,
        overflow: 'hidden',

        // borderWidth:1,
        // borderColor: 'red',
    },
    image: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',

        borderWidth: 3,
        borderColor: '#9552b6ff',
        borderRadius: 50,
        overflow: 'hidden'
    },
    text: {
        // flex: 3,
        marginLeft: 30,
    }
});
