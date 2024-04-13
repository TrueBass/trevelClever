
import { View, Text, Pressable, StyleSheet } from 'react-native';

function AddRoundButton({onPress}){
  return (
    <View style={styles.roundButton}>
      <Pressable android_ripple={{color: '#210644'}} style={({pressed}) => pressed?[styles.roundButton,styles.pressed]:styles.roundButton } onPress={onPress}>
        <Text style={styles.plusIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  roundButton: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#a362cfff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 45,
    color: 'white',
    justifyContent: 'center'
  },
  pressed: {
    opacity: 0.75,
}
});

export default AddRoundButton;
