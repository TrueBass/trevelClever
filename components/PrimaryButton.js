import {View, Text, Pressable, StyleSheet} from 'react-native';

function PrimaryButton ({children, onPress}){

    return (
        <View style={styles.buttonOuterContainer}>
            <Pressable
                style={({pressed}) => 
                    pressed? [styles.buttonInnerContainer, styles.pressed]:
                    styles.buttonInnerContainer
                }
                onPress={onPress}
            >
                <Text style={styles.buttonText}>{children}</Text>
            </Pressable>
        </View>
    );
}

export default PrimaryButton;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        borderRadius: 16,
        width: 103,
        overflow: 'hidden'
    },
    buttonInnerContainer: {
        backgroundColor: '#FFF8E3',
        padding: 8,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: '400'
    },
    pressed: {
        opacity: 0.75,
    }
});