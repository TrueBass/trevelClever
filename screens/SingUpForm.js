import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";

// firebase imports
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../backend/config";

// custom components
import Title from '../components/Title';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

function SignUpForm({onCancel}){

    const [userInputNickname, setUserInputNickname] = useState('');
    const [userInputEmail, setUserInputEmail] = useState('');
    const [userInputPasswd, setUserInputPasswd] = useState('');

    async function SignUpHandler (){

      if (userInputEmail.trim() === '' ||
          userInputNickname.trim() === '' ||
          userInputPasswd.trim() === '') {
          Alert.alert('Please fill in all fields.');
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
        // Here should be Ania's schemas
        // (No pushing, just waiting;))
        const userData = { userInputPasswd, userInputEmail, userInputNickname };
        // Update Realtime db with user data
        await set(ref(db, 'users/' + response.user.uid), userData);
        // Success message and form reset
        Alert.alert(
          "Registration Successful",
          "U have been registered successfully"
        );
        setUserInputEmail('');
        setUserInputPasswd('');
        setUserInputNickname('');
      } catch (error) {
        // Handle registration errors
        console.error("Registration failed:", error);
        Alert.alert('Register failed:', error.message);
      }
    }
    
    function cancelButtonHandler(){
      if(userInputEmail || userInputNickname || userInputPasswd)
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