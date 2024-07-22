import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateRoomData() {
  const navigation = useNavigation();
  const {control, handleSubmit, formState: {errors}} = useForm();
  const [loading, setLoading] = useState(false);

  async function createRoom(info) {
    console.log(info);
    const token = await AsyncStorage.getItem('token');
    // const url = `https://nusplorer.onrender.com/rooms`;
    const url = `http://10.0.2.2:3000/rooms`;
    setLoading(true);

    axios.post(url, info, { 
      headers: {
        'Authorization': token ? `Bearer ${token}` : null
      }
    }).then((response) => {
      Alert.alert('Room created successfully')
      setLoading(false);
      navigation.goBack();
    }).catch((error) => {
      const errorStatus = error.response.status;
      const errorMessage = error.response.data.error;

      if (errorStatus == 400) {
        Alert.alert('Bad request', errorMessage);
      } else if (errorStatus == 401 || errorStatus == 403) {
        Alert.alert(errorMessage, 'Please login again!', [
          {
            text: 'OK',
            onPress: () => {
              AsyncStorage.removeItem('token');
              navigation.navigate('Login');
              console.log('Token cleared and navigated to Login');
            }
          }
        ])
      } else if (errorStatus == 500) {
        Alert.alert(
          'Failed to create room data',
          "An error occurred in the server while creating room"
        );
      } else {
        Alert.alert(
          'Failed to create room data',
          "An unknown error occurred while creating room"
        );
      }
      setLoading(false);
      console.log("Error creating room: ", errorMessage);
    })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <UserInput 
          type='data'
          label='Room Code' 
          fieldName='roomCode'
          info='e.g. LT17, COM1-02-01'
          control={control}
          rules={{ 
            required: 'Please enter the room code',
            minLength: {
              value: 3,
              message: 'Room code should be at least 3 characters long'
            }
          }} />
        <UserInput 
          type='data'
          label='Building name' 
          fieldName='buildingName'
          info='e.g. LT17, COM1, AS3'
          control={control}
          rules={{ 
            required: 'Please enter the building name',
            minLength: {
              value: 3,
              message: 'Building name should be at least 3 characters long'
            }
          }} />
        <UserInput 
          type='data'
          label='Floor number' 
          fieldName='floorNumber'
          info='Input floor number. For basement floors, use B1, B2, etc.'
          control={control}
          rules={{ 
            required: 'Please enter the floor number',
            pattern: {
              value: /^(B[1-9]|[1-9]\d*)$/,
              message: 'Invalid floor number',
            },
            maxLength: {
              value: 2,
              message: 'Floor number should be at most 2 characters long'
            }
          }} />
        <UserInput 
          type='data'
          label='Room name' 
          fieldName='roomName'
          info='e.g. Lecture Theatre 17, Seminar Room 5, Programming Lab 2'
          control={control}
          rules={{ 
            required: 'Please enter the room name',
            minLength: {
              value: 3,
              message: 'Room name should be at least 3 characters long'
            }
          }} />
        {loading ? <ActivityIndicator animating={true} size='large' color='#003db8' /> 
          : <UserSubmitButton buttonName='Create' onPress={handleSubmit(createRoom)} />}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#d1fdff',
    padding: 8,
  },
});
