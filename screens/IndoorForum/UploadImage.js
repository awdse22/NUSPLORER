import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import IndoorDataInput from '../../Components/IndoorForumComponents/IndoorDataInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function UploadImage({ route }) {
    const navigation = useNavigation();
    const { roomId, dataType } = route.params;
    const {control, handleSubmit, formState: {errors} } = useForm();

    async function uploadImage(userResponse) {
        const data = {
            description: '',
            dataType: dataType,
            imageData: userResponse.imageData
        }
        const token = await AsyncStorage.getItem('token');
        const url = `http://10.0.2.2:3000/rooms/${roomId}/photos`;

        axios.post(url, data , { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            console.log('Image uploaded');
            navigation.goBack();
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 400) {
                Alert.alert(errorMessage);
            } else if (errorStatus == 500) {
                Alert.alert("Failed to upload image");
                console.log("Error uploading image: ", errorMessage);
            }
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <IndoorDataInput 
                    type='image'
                    label='Upload Image' 
                    fieldName='imageData'
                    info={`Upload ${dataType.toLowerCase()} to help guide other users to the locations`}
                    control={control}
                    rules={{ 
                        required: 'You need to upload an image',
                    }} 
                />
                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={handleSubmit(uploadImage)}>
                        <View style={styles.submitButton}>
                            <Text style={styles.submitButtonText}> Upload </Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
    submitContainer: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButton: {
        borderRadius: 6,
        backgroundColor: '#2164cf',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    }
})