import {React, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet
} from 'react-native';

import {auth} from '../backend/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

import PrimaryButton from '../components/PrimaryButton';

function LoginForm({onPressLogin, onCancel}) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
      Alert.alert('Login successful!');
      // loads main screen
      // won't load it if there are some errors
      onPressLogin();
    } catch (error) {
      Alert.alert('Login error:', error.message);
    }
  };

  function cancelButtonHandler() {
    onCancel();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <PrimaryButton onPress={cancelButtonHandler}>
        Cancel
      </PrimaryButton>
      <PrimaryButton onPress={handleLogin}>
        Log In
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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