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
import { db } from "./backend/config"
import { ref, set, push, child } from "firebase/database";

// custom components imports:
// for code minimalization
import SigninForm from './screens/SinginForm';

export default function App() {

  return (
    <LinearGradient
      colors={['#FFE6E6','#7a5492']}
      style={styles.gradientComponent}
    >
      <SafeAreaView style={styles.gradientComponent}>
        <SigninForm />
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
