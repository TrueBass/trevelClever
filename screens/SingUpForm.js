import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { showMessage } from 'react-native-flash-message';
import FlashMessage from "react-native-flash-message";
import {FontAwesome6} from "@expo/vector-icons";

// firebase imports
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../backend/config";

// backend imports
import Users from "../models/usersSchema";

// custom components
import Title from '../components/Title';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

function SignUpForm({ onCancel, onPressSignUp }) {

  const [userInputNickname, setUserInputNickname] = useState('');
  const [userInputEmail, setUserInputEmail] = useState('');
  const [userInputPasswd, setUserInputPasswd] = useState('');
  const [emailEmptySrting,setEmailEmptyStr] = useState(false);
  const [nicknameEmptySrting,setNicknameEmptyStr] = useState(false);
  const [passwordEmptySrting,setPasswordEmptyStr] = useState(false);

  async function SignUpHandler() {

    if (userInputEmail.trim() === '' ||
      userInputNickname.trim() === '' ||
      userInputPasswd.trim() === '') {
      // Alert.alert('Please fill in all fields.');
      showMessage({
        message: 'Error',
        description: "Please fill in all fields.",
        type: 'warning',
        duration: 5000
      });
      return;
    }

    try {
      // HERE!
      // command "response = await createUserWithEmailAndPassword"
      // for saving user to Authentication and
      // command "await set" for savind user to Realtime db
      // so it's binded.
      // Create user with Firebase Authentication
      const response = await createUserWithEmailAndPassword(auth, userInputEmail, userInputPasswd);
      // Prepare user data for Realtime db
      // const userData = { userInputPasswd, userInputEmail, userInputNickname };
      Users.email = userInputEmail;
      Users.nickname = userInputNickname;
      Users.password = userInputPasswd;
      Users.numFriends = 0;
      // Update Realtime db with user data
      await set(ref(db, 'users/' + response.user.uid), Users);
      // Success message and form reset
      showMessage({
        message: "Registration Successful",
        type: 'success',
        duration: 3000,
        icon: props => <FontAwesome6 name="check-circle" size={30} color="white" />
      });
      setUserInputEmail('');
      setUserInputPasswd('');
      setUserInputNickname('');
      onPressSignUp();
    } catch (error) {
      // Handle registration errors
      const signUpMsgMessage = "Signup error";
      let signUpMsgDescription;
      let signUpMsgType = "warning";

      switch (error.code) {
        case 'auth/weak-password':
          signUpMsgDescription = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/email-already-in-use':
          signUpMsgDescription = 'Email address is already in use. Please try a different email.';
          break;
        case 'auth/invalid-email':
          signUpMsgDescription = 'Please enter a valid email address.';
          signUpMsgType = 'danger';
          break;
        case 'auth/network-request-failed':
          signUpMsgDescription = 'Network error. Please check your internet connection.';
          signUpMsgType = 'danger';
          break;
        default:
          signUpMsgDescription = error.message; // Fallback for other errors
      }

      showMessage({
        message: signUpMsgMessage,
        description: signUpMsgDescription,
        type: signUpMsgType,
        duration: 3000
      });
    }
  }

  function cancelButtonHandler() {
    if (userInputEmail || userInputNickname || userInputPasswd)
      setUserInputEmail('');
      setUserInputPasswd('');
      setUserInputNickname('');
    onCancel();
  }

  return (
    <View style={styles.mainScreen}>
      <View style={styles.textDash}>
        <Title>Sign Up TrevelClever</Title>
      </View>
      <View style={styles.inputComponent}>
        <InputField
          value={userInputNickname}
          fieldName={'Nickname'}
          emptyString={nicknameEmptySrting}
          onChangeText={(userNicknameValue) => {
            setUserInputNickname(userNicknameValue);
            setNicknameEmptyStr(userNicknameValue.trim().length === 0);
          }}
        />
        <InputField
          fieldName={'Email'}
          value={userInputEmail}
          emptyString={emailEmptySrting}
          onChangeText={(userEmailValue) => {
            setUserInputEmail(userEmailValue);
            setEmailEmptyStr(userEmailValue.trim().length === 0);
          }}
          
        />
        <InputField
          fieldName={'Password'}
          value={userInputPasswd}
          emptyString={passwordEmptySrting}
          onChangeText={(userPasswdValue) => {
            setUserInputPasswd(userPasswdValue);
            setPasswordEmptyStr(userPasswdValue.trim().length === 0);
          }}
          secureTextEntry={true}
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
            onPress={SignUpHandler}
          >
            Confirm
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}

export default SignUpForm;

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  textDash: {
    padding: 8,
    margin: 50,
    borderRadius: 24,
    borderWidth: 3,
    backgroundColor: "#7a549277",
    borderColor: '#7a5492',
    overflow: 'hidden',
  },
  inputComponent: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 8,
    margin: 50,
  },
  buttonsComponent: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 50,
  },
  buttonsBackGround: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 16,
  }
});