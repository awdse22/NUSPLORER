import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import AuthenticationInput from '../../Components/AuthenticationInput';

export default function ChangePasswordScreen() {
  const { control, handleSubmit } = useForm();
  const navigator = useNavigation();

  function logout() {
    AsyncStorage.removeItem('token');
    navigator.navigate('Login');
    console.log('token cleared');
  }

  async function updatePassword(values) {
    try {
      if (values.newPassword !== values.confirmNewPassword) {
        Alert.alert('New password and confirm password must match');
      } else {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const url = `http://10.0.2.2:3000/${userId}/updatePassword`;

        await axios.put(url, values, {
          headers: {
            Authorization: token ? `Bearer ${token}` : null,
          },
        });
        logout();
      }
    } catch (error) {
      Alert.alert('Error updating password', error.response.data.message);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AuthenticationInput
          fieldName="currentPassword"
          label="Current password"
          secureTextEntry
          control={control}
          rules={{ required: 'Current password is required' }}
        />

        <AuthenticationInput
          fieldName="newPassword"
          label="New password"
          secureTextEntry
          control={control}
          rules={{ required: 'New password is required' }}
        />

        <AuthenticationInput
          fieldName="confirmNewPassword"
          label="Confirm new password"
          secureTextEntry
          control={control}
          rules={{ required: 'Confirm new password is required' }}
        />
        <TouchableOpacity
          title="Update Password"
          onPress={handleSubmit(updatePassword)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Update password</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 32,
    width: '50%',
    height: 45,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#2164cf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});
