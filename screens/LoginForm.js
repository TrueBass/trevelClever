import { React, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { auth } from '../backend/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';

function LoginForm({onPressLogin, onCancel}) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailEmptyString, setEmailEmptyString] = useState(false);
  const [passwdEmptyString,setPasswdEmptyString] = useState(false);
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
      showMessage({
        type: 'success',
        message: 'Login successful!',
        icon: props => <FontAwesome6 name="check-circle" size={30} color="white" />,
        duration: 3000
      });
      // loads main screen
      // won't load it if there are some errors
      onPressLogin();
    } catch (error) {
      const message = 'Login error';
      let description;

      switch (error.code) {
        case 'auth/wrong-password':
          description = 'Incorrect password. Please try again.';
          break;
        case 'auth/user-not-found':
          description = 'User not found. Please check your email address.';
          break;
        case 'auth/network-request-failed':
          description = 'Network error. Please check your internet connection.';
          break;
        case 'auth/invalid-email':
          description = 'Incorrect email.';
          break;
        default:
          description = error.message; // Fallback for other errors
      }

      showMessage({
        type: 'danger',
        message,
        description,
        duration: 3000,
        icon: props => <Entypo name="circle-with-cross" size={30} color="white" />
      });
    }
  };

  function cancelButtonHandler() {
    onCancel();
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Text style={styles.title}>Firebase Login Screen</Text>
      </View>
      <View style={{flex:2, justifyContent: 'center', marginHorizontal: 30}}>
        <InputField
          fieldName="Email"
          value={email}
          onChangeText={(text) => {
            setEmailEmptyString(text.trim().length === 0);
            setEmail(text);
          }}
          emptyString={emailEmptyString}
        />
        <InputField
          value={password}
          fieldName="Password"
          onChangeText={(text) => {
            setPasswdEmptyString(text.trim().length === 0);
            setPassword(text);
          }}
          secureTextEntry={true}
          emptyString={passwdEmptyString}
        />
      </View>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        <PrimaryButton onPress={cancelButtonHandler}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onPress={handleLogin}>
          Log In
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default LoginForm;