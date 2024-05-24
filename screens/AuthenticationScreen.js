import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';

export default function AuthenticationScreen() {
    const navigation = useNavigation();
    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.loginScreenContainer}>
            <Text style={styles.nusplorerFont}>NUSPLORER</Text>
            <Text>Login ID:</Text>
            <TextInput 
                value={loginInput} 
                onChangeText={setLoginInput} 
                style={styles.loginInput}/>
            <Text>Password:</Text>
            <TextInput 
                secureTextEntry
                value={passwordInput} 
                onChangeText={setPasswordInput} 
                style={styles.loginInput}/>
                
            <Button title='login' onPress={() => navigation.navigate('OutdoorMap')} />
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
    loginScreenContainer: {
      backgroundColor:'#fff000',
      height: 300,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 30,
    },
    nusplorerFont: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 40
    },
    loginInput: {
      textAlign: 'left',
      fontSize: 20,
      backgroundColor: 'white',
      borderWidth: 2,
      width: 200,
      height: 40,
      padding: 5
    }
});