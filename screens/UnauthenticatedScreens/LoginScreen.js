import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TextInput, 
  Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AuthScreenButton from '../../Components/AuthScreenButton';
import AuthenticationInput from '../../Components/AuthenticationInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {control, handleSubmit, reset, formState: {errors}} = useForm();
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // reset entries whenever this screen is loaded
      reset({
        email: '',
        password: '',
      })
    }, [])
  );

  const AppName = () => {
    return (
      <View>
        <Text style={styles.nusplorerFont}>NUSPLORER</Text>
      </View>
    )
  }

  function authenticate(credentials) {
    // const url = 'https://nusplorer.onrender.com/login';
    const url = 'http://10.0.2.2:3000/login';

    axios.post(url, credentials).then((response) => {
      console.log('Login success with token ' + response.data.token);

      setErrorVisible(false);
      AsyncStorage.setItem('token', response.data.token);
      navigation.navigate('MainInterface');
    }).catch(error => {
      setErrorMessage(error.response.data.message);
      setErrorVisible(true);
      const errorStatus = error.response.status;
      if (errorStatus != 400 && (errorStatus != 401 && errorStatus != 500)) {
        console.error('Error in backend: ', error);
      }
    })
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
          <View style={styles.loginInterfaceContainer}>
            <AppName />
            <AuthenticationInput 
              fieldName='email'
              label='Email'
              control={control}
              rules={{required: 'Please enter your email'}} />

            <AuthenticationInput 
              fieldName='password'
              label='Password'
              secureTextEntry={true}
              control={control}
              rules={{required: 'Please enter your password'}} />
            {errorVisible && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            <AuthScreenButton buttonName='Login' onPress={handleSubmit(authenticate)} />
            <AuthScreenButton 
              buttonName='Register an account' 
              onPress={() => navigation.navigate('Account Registration')} />
            <AuthScreenButton 
              buttonName='Forgot password' 
              onPress={() => navigation.navigate('Reset Password')} />
          </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d1fdff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginInterfaceContainer: {
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    width: 320,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 15,
  },
  nusplorerFont: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40
  },
  statusText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  authenticationInput: {
    container: {
      justifyContent: 'center',
      padding: 10,
      width: '95%'
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 15,
      paddingLeft: 5,
    },
    inputBox: {
      textAlign: 'left',
      fontSize: 20,
      backgroundColor: 'white',
      borderWidth: 2,
      width: '95%',
      height: 40,
      padding: 5,
      margin: 5
    },
  }
});