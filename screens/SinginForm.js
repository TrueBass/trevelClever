import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";

import { db } from "../backend/config"
import { ref, set, push, child } from "firebase/database";

import Title from '../components/Title';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

function SigninForm(){

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
    
      function cancelButtonHandler(){
        if(!(userInputEmail || userInputNickname || userInputPasswd))
          return;
        setUserInputEmail('');
        setUserInputPasswd('');
        setUserInputNickname('');
      }

    return (
        <View style={styles.mainScreen}>
            <View style={styles.textDash}>
                <Title>Sign In TrevelClever</Title>
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
    );
}

export default SigninForm;

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
        borderRadius: 32,
        borderWidth: 3,
        backgroundColor: "#7a549277",
        borderColor: '#7a5492',
        overflow: 'hidden'
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
        borderRadius: 32,
        borderWidth: 3,
        backgroundColor: "#7a549277",
        borderColor: '#7a5492',
        overflow: 'hidden'
      }
});