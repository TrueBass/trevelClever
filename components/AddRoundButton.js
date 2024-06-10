import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

function AddRoundButton({ onPress }) {
  return (
    <View style={styles.roundButtonContainer}>
      <Pressable
        android_ripple={{ color: '#EBB4AD' }}
        style={({ pressed }) => (pressed ? [styles.roundButton, styles.pressed] : styles.roundButton)}
        onPress={onPress}
      >
        <Text style={styles.plusIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  roundButtonContainer: {
    position: 'absolute', // Positioning the button absolutely
    bottom: 20, // 20 units from the bottom
    left: '50%', // Centered horizontally by setting left to 50%
    transform: [{ translateX: -35 }], // Adjust half of the button width (70/2) to center it
  },
  roundButton: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#FFCF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 45,
    color: 'white',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default AddRoundButton;
