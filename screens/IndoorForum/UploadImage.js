import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function UploadImage({ route }) {
  const navigation = useNavigation();
  const { roomId, dataType } = route.params;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function uploadImage(userResponse) {
    const data = {
      description: userResponse.description,
      dataType: dataType,
      imageData: userResponse.imageData,
    };
    const token = await AsyncStorage.getItem('token');
    // const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos`;
    const url = `http://10.0.2.2:3000/rooms/${roomId}/photos`;

    axios
      .post(url, data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        console.log('Image uploaded');
        navigation.goBack();
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        const errorMessage = error.response.data.message;
        if (errorStatus == 400) {
          Alert.alert(errorMessage);
        } else if (errorStatus == 500) {
          Alert.alert('Failed to upload image');
          console.log('Error uploading image: ', errorMessage);
        }
      });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <UserInput
          type="image"
          label="Upload Image"
          fieldName="imageData"
          info={`Upload ${dataType.toLowerCase()} to help guide other users to the locations`}
          control={control}
          rules={{
            required: 'You need to upload an image',
          }}
        />
        <UserInput
          type="post"
          label="Description"
          fieldName="description"
          info={`(Optional) A description for the image`}
          control={control}
          rules={{
            maxLength: {
              value: 100,
              message: 'The description is too long!',
            },
          }}
        />
        <UserSubmitButton buttonName="Upload" onPress={handleSubmit(uploadImage)} />
      </ScrollView>
    </View>
  );
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
