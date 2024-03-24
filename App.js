// react components imports
import { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import testrun from "./models/test/";

// custom components imports:
// for code minimalization
import SignUpForm from './screens/SingUpForm';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginForm from './screens/LoginForm';
import SideMenuScreen from './screens/SideMenuScreen';

export default function App() {

  const [screen, setScreen] = useState(<WelcomeScreen onUserOption={showScreenHandler}/>);
  
  function loginButtonHandler(){
    setScreen(<SideMenuScreen />);
  }

  function showScreenHandler(pickedOption){
    // pickedOption: Boolean
    // pickedOption will be returned from the component
    // where it was put, for example in setScreen below
    // it emplaced in onCancel prop.
    setScreen(pickedOption?<LoginForm onPressLogin={loginButtonHandler} onCancel={cancelSingUpHandler}/>:<SignUpForm onCancel={cancelSingUpHandler}/>);
  }

  function cancelSingUpHandler(){
    // in this func we don't need a param, cuz
    // there is only one screen we need to set.
    setScreen(<WelcomeScreen onUserOption={showScreenHandler}/>);
  }

  // testrun();

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
