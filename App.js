// react components imports
import { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage from 'react-native-flash-message';
//import {findByNick,getUserPhoto} from "./models/test/";
import {updateGroupMembers} from './models/groupTest/';
// custom components imports:
// for code minimalization
import SignUpForm from './screens/SingUpForm';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginForm from './screens/LoginForm';
import SideMenuScreen from './screens/SideMenuScreen';

export default function App() {

  const [screen, setScreen] = useState(<WelcomeScreen onUserOption={showScreenHandler}/>);
  const logInScreen = <LoginForm onPressLogin={loginButtonHandler} onCancel={cancelSingUpHandler}/>;
  const signUpScreen = <SignUpForm onCancel={cancelSingUpHandler} onPressSignUp={signUpButtonHandler}/>;
 
  function loginButtonHandler(){
    setScreen(<SideMenuScreen />);
  }
  function signUpButtonHandler(){
    setScreen(logInScreen);
  }

  function showScreenHandler(pickedOption){
    // pickedOption: Boolean
    // pickedOption will be returned from the component
    // where it was put, for example in setScreen below
    // it emplaced in onCancel prop.
    setScreen(pickedOption ? logInScreen : signUpScreen);
  }

  function cancelSingUpHandler(){
    // in this func we don't need a param, cuz
    // there is only one screen we need to set.
    setScreen(<WelcomeScreen onUserOption={showScreenHandler}/>);
  }
  const userId = "BaJ6rgAelpfummrGipoNXQktip22";
  const groupId = "-NuS9gCXxn68T3i0X9wU";
  
  // getUserPhoto('test@gmail.com');

  return (
    <LinearGradient
      colors={['#FFE6E6','#7a5492']}
      style={styles.gradientComponent}
    >
      <SafeAreaView style={styles.gradientComponent}>
        {screen}
        <FlashMessage
          position="bottom"
          style={styles.flashMsg}
          titleStyle={{
            fontSize: 18,
            marginLeft: 20
          }}
          textStyle={{
            fontSize: 18,
            marginLeft: 20
          }}
        />
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
  flashMsg: {
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
  }
});
