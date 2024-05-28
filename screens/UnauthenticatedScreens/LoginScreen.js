import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import AuthenticationInput from '../../Components/AuthenticationInput';
import AuthScreenButton from '../../Components/AuthScreenButton';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {control, handleSubmit, formState: {errors}} = useForm();

  // Component for NUSPLORER app name
  const AppName = () => {
    return (
      <View>
        <Text style={styles.nusplorerFont}>NUSPLORER</Text>
      </View>
    )
  }

  function authenticate(data) {
    console.log(data);
    navigation.navigate('MainInterface');
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
          <View style={styles.loginInterfaceContainer}>
            <AppName />
            
            <AuthenticationInput 
              fieldName='username'
              label='Username'
              control={control}
              rules={{required: 'Please enter your user ID'}} />

            <AuthenticationInput 
              fieldName='password'
              label='Password'
              control={control}
              secureTextEntry={true}
              rules={{required: 'Please enter your password'}} />

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
      backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginInterfaceContainer: {
      backgroundColor:'#fff000',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 20,
      width: 300
    },
    nusplorerFont: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 40
    },
    // the style below is unused for now
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