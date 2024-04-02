import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function FriendTitle({ nickname, profilePhoto = null }) {

    return (
        <View style={styles.main}>
            <View style={styles.backGround}>
                <View style={styles.image}>
                    {
                        profilePhoto
                            ? <Image source={{ uri: profilePhoto }} style={{ width: 100, height: 100 }} />
                            : <FontAwesome5 name="user-alt" size={100} color="black" />
                    }
                </View>
                <Text style={styles.text}>{nickname}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backGround: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#bc86d7ff',
        borderRadius: 50,
        overflow: 'hidden',
        width: 100
    },
    image: {
        borderWidth: 3,
        borderColor: '#9552b6ff',
        borderRadius: 50,
        overflow: 'hidden'
    },
    text: {
        marginLeft: 30,
        fontSize: 20,
    }
});
