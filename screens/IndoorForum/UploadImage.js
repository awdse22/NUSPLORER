import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function UploadImage({ route }) {
  const navigation = useNavigation();
  const { roomId, dataType } = route.params;
  const {control, handleSubmit, formState: {errors} } = useForm();
  const [loading, setLoading] = useState(false);

  async function uploadImage(userResponse) {
    const data = {
      description: userResponse.description,
      dataType: dataType,
      imageData: userResponse.imageData,
    };

    const token = await AsyncStorage.getItem('token');
    // const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos`;
    const url = `http://10.0.2.2:3000/rooms/${roomId}/photos`;
    setLoading(true);

    axios.post(url, data , { 
      headers: {
        'Authorization': token ? `Bearer ${token}` : null
      }
    }).then((response) => {
      console.log('Image uploaded');
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
        ]);
      } else if (errorStatus == 500) {
        Alert.alert(
          'Failed to upload image',
          "An error occurred in the server while uploading image"
        );
      } else {
        Alert.alert(
          'Failed to upload image',
          'An unknown error occurred while uploading image'
        );
      }
      console.log("Error uploading image: ", errorMessage);
      setLoading(false);
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <UserInput 
          type='image'
          label='Upload Image' 
          fieldName='imageData'
          info={`Upload ${dataType.toLowerCase()} to help guide other users to the locations`}
          control={control}
          rules={{ 
            required: 'You need to upload an image',
          }} 
        />
        <UserInput 
          type='post'
          label='Description' 
          fieldName='description'
          info={`(Optional) A description for the image`}
          control={control}
          rules={{ 
            maxLength: {
              value: 100,
              message: 'The description is too long!'
            }
          }} 
        />
        {loading ? <ActivityIndicator animating={true} size='large' color='#003db8' /> 
          : <UserSubmitButton buttonName='Post' onPress={handleSubmit(uploadImage)} />}
      </ScrollView>
    </View>
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
