// react components imports
import { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';

// firebase imports
import { ref, set, push, child } from "firebase/database";

// custom components imports:
// for code minimalization
//import SignUpForm from './screens/SingUpForm';
//import MainScreen from './screens/MainScreen';
import LoginForm from './screens/LoginForm';
// {/* <SigninForm /> 
export default function App() {

  return (
    <LinearGradient
      colors={['#FFE6E6','#7a5492']}
      style={styles.gradientComponent}
    >
      <SafeAreaView style={styles.gradientComponent}>
        <LoginForm/>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientComponent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
});
