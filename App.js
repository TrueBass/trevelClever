// react components imports
import {useState} from 'react';
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
<<<<<<< Updated upstream
import Title from './components/Title';
import InputField from './components/InputField';
import PrimaryButton from './components/PrimaryButton';
=======
import SignUpForm from './screens/SingUpForm';
import MainScreen from './screens/MainScreen';
import LoginForm from './screens/LoginForm';
//testing purposes: import {testrun} from './models/test';
>>>>>>> Stashed changes

export default function App() {
 //testing purposes: testrun("UserOne");

  const [userInputNickname, setUserInputNickname] = useState('');
  const [userInputEmail, setUserInputEmail] = useState('');
  const [userInputPasswd, setUserInputPasswd] = useState('');

  function confirmButtonHandler (){
    if (userInputEmail.trim() === '' ||
        userInputNickname.trim() === '' ||
        userInputPasswd.trim() === '') {
      alert('Please fill in all fields.');
      cancelButtonHandler();
      return;
    }

    const userData = {
      nickname: userInputNickname,
      email: userInputEmail,
      password: userInputPasswd
    };

    const newKey = push(child(ref(db), 'users')).key;

    set(ref(db, 'users/' + newKey), userData).then(() => {
      Alert.alert(
        "Registration Successful",
        "U have been registered successfully"
      );
      setUserInputEmail('');
      setUserInputPasswd('');
      setUserInputNickname('');
    }).catch((error) => {
      Alert.alert(
      "Registration Fail",
      "An error occured during registration");
      console.log("Registration failed",error);
    });
  }
<<<<<<< Updated upstream

  function cancelButtonHandler(){
    if(!(userInputEmail || userInputNickname || userInputPasswd))
      return;
    setUserInputEmail('');
    setUserInputPasswd('');
    setUserInputNickname('');
=======
  function cancelSingUpHandler(){
    // in this func we don't need a param, cuz
    // there is only one screen we need to set.
    setScreen(<MainScreen onUserOption={showScreenHandler}/>);
>>>>>>> Stashed changes
  }

  return (
    <LinearGradient colors={['#FFE6E6','#7a5492']} style={styles.gradientComponent}>
      <SafeAreaView style={styles.gradientComponent}>
        <View style={styles.textDash}>
          <Title>Sign In TrevelClever</Title>
        </View>
        <View style={styles.mainScreen}>
          <View style={styles.textInputView}>
            <InputField
              fieldName={'Nickname'}
              placeholder={'nickname'}
              onChangeText={(userNicknameValue) => {
                setUserInputNickname(userNicknameValue)
              }}
              value={userInputNickname}
            />
            <InputField 
              fieldName={'Email'}
              placeholder={'email'}
              value={userInputEmail}
              onChangeText={(userEmailValue) =>
                setUserInputEmail(userEmailValue)
              }
            />
            <InputField
              fieldName={'Password'}
              placeholder={'password'}
              value={userInputPasswd}
              onChangeText={(userPasswdValue) =>
                setUserInputPasswd(userPasswdValue)
              }
            />
          </View>
          <View style={styles.buttonsComponent}>
            <View style={styles.buttonsBackGround}>
              <PrimaryButton
                onPress={cancelButtonHandler}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onPress={confirmButtonHandler}
              >
                Confirm
              </PrimaryButton>
            </View>
          </View>
        </View>
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
  mainScreen: {
    flex: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  textDash: {
    flex: 1,
    padding: 8,
    marginHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#7a5492',
    overflow: 'hidden'
  },
  textInputView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    margin: 50,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#7a5492',
    overflow: 'hidden'
  },
  buttonsComponent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  buttonsBackGround: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 16,
    marginHorizontal: 50,
    borderRadius: 16,
    backgroundColor: '#7a5492',
    overflow: 'hidden'
  }
});
