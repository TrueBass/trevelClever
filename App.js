// react components imports
import { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

// firebase imports
import { ref, set, push, child } from "firebase/database";

// custom components imports:
// for code minimalization
import SignUpForm from './screens/SingUpForm';
import MainScreen from './screens/MainScreen';
import LoginForm from './screens/LoginForm';
// {/* <SigninForm /> 
export default function App() {

  const [isRegistered, setIsRegistered] = useState();
  const [showMainScreen, setShowMainScreen] = useState();
  const [screen, setScreen] = useState(<MainScreen onUserOption={showScreenHandler}/>);

  function showScreenHandler(pickedOption){
    // pickedOption: Boolean
    // pickedOption will be returned from the component
    // where it was put, for example in setScreen below
    // it emplaced in onCancel prop.
    setScreen(pickedOption?<LoginForm onCancel={cancelSingUpHandler}/>:<SignUpForm onCancel={cancelSingUpHandler}/>);

  }

  function cancelSingUpHandler(){
    // in this func we don't need a param, cuz
    // there is only one screen we need to set.
    setScreen(<MainScreen onUserOption={showScreenHandler}/>);
  }

  return (
    <LinearGradient
      colors={['#FFE6E6','#7a5492']}
      style={styles.gradientComponent}
    >
      <SafeAreaView style={styles.gradientComponent}>
        {screen}
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
