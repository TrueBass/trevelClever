import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import CrossButton from './CrossButton';
import AddRoundButton from './AddRoundButton';

export default function FriendTitle({ onRemove = null, currentUserId = null, friendId = null, nickname, profilePhoto = null, onPlusPress = null }) {

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
                <Text adjustsFontSizeToFit={true} style={{ fontSize: 20 }}>{nickname}</Text>
            </View>
            <View style={{marginRight: 20}}>
                {
                    onPlusPress
                    ? <AddRoundButton onPress={onPlusPress}/>
                    : <CrossButton onRemove={onRemove} currentUserId={currentUserId} friendId={friendId}/>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    backGround: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxHeight: 100,
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
        // flex: 1,
        // marginHorizontal: 30
    }
});
