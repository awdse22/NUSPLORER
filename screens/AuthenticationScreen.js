import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


// Component for login ID input
const IDInput = ({ onStateChange }) => {
  const [input, setInput] = useState('');

  function handleStateChange(value) {
    setInput(value);
    onStateChange(value);
  }

  return (
    <View style={styles.inputComponent}>
      <Text>Login ID:</Text>
      <TextInput 
        value={input} 
        onChangeText={handleStateChange} 
        style={styles.inputBox}/>
    </View>
  )
}

// Component for password input
const PasswordInput = ({ onStateChange }) => {
  const [input, setInput] = useState('');

  function handleStateChange(value) {
    setInput(value);
    onStateChange(value);
  }

  return (
    <View style={styles.inputComponent}>
      <Text>Password:</Text>
      <TextInput 
        secureTextEntry
        value={input} 
        onChangeText={handleStateChange} 
        style={styles.inputBox}/>
    </View>
  )
}

export default function AuthenticationScreen() {
  const navigation = useNavigation();
  const [idInput, setIDInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [statusVisible, setStatusVisible] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  function handleIDInputChange(value) {
    setIDInput(value);
    setStatusVisible(false);
  }

  function handlePasswordInputChange(value) {
    setPasswordInput(value);
    setStatusVisible(false);
  }

  // Component for NUSPLORER app name
  const AppName = () => {
    return (
      <View>
        <Text style={styles.nusplorerFont}>NUSPLORER</Text>
      </View>
    )
  }

  // Component for login status (displays incorrect password/ID message, etc.)
  const Status = () => {
    // Will include a loading status when authentication system is implemented
    return (
      <View style={styles.statusContainer} >
        {statusVisible && <Text style={styles.statusText}>{loginErrorMessage}</Text>}
      </View>
    )
  }

  function authenticate() {
    let loginSuccess = true;
    if (idInput.length == 0) {
      setLoginErrorMessage('Please enter your login ID');
      loginSuccess = false;
    } else if (passwordInput.length == 0) {
      setLoginErrorMessage('Please enter your password');
      loginSuccess = false;
    } else if (false) {
      // if details are incorrect, current under place holder
      setLoginErrorMessage('Incorrect ID/Password');
      loginSuccess = false;
    }
    
    if (loginSuccess) {
      navigation.navigate('MainInterface');
    } else {
      setStatusVisible(true);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
          <View style={styles.loginInterfaceContainer}>
            <AppName />
            <IDInput onStateChange={handleIDInputChange} />
            <PasswordInput onStateChange={handlePasswordInputChange}/>
            <Status />
            <Button title='login' onPress={authenticate}/>
            <Button title='register' onPress={() => console.log('Register button pressed')} />
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 0,
      flexDirection: 'column',
      flex: 1,
      width: '100%',
      height: '100%',
      borderWidth: 1,
      backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nusplorerFont: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 40
    },
    loginInterfaceContainer: {
      backgroundColor:'#fff000',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 30,
    },
    inputComponent: {
      padding: 15
    },
    inputBox: {
      textAlign: 'left',
      fontSize: 20,
      backgroundColor: 'white',
      borderWidth: 2,
      width: 200,
      height: 40,
      padding: 5
    },
    statusContainer: {
      width: 200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusText: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: 15
    }
});