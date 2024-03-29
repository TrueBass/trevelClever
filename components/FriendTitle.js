import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function FriendTitle({nickname, profilePhoto = null}){
    
    return (
        <View>
            {profilePhoto && (
                <Image
                    source={{ uri: profilePhoto }}
                    style={{ width: 100, height: 100 }}
                />
            )}
            {!profilePhoto &&
                <FontAwesome5
                    name="user-alt"
                    size={24}
                    color="black"
                />
            }
            <Text >{nickname}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

});
