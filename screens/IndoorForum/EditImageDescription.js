import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function EditImageDescription({ route }) {
    const navigation = useNavigation();
    const { roomId, imageMetadataId, description } = route.params;
    const {control, handleSubmit, setValue, formState: {errors} } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (description) {
            setValue('description', description)
        }
    })

    function logout(errorMessage) {
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
    };

    async function editDescription(userResponse) {
        const token = await AsyncStorage.getItem('token');
        const url=`http://10.0.2.2:3000/rooms/${roomId}/photos/${imageMetadataId}`;
        setLoading(true);

        axios.put(url, userResponse, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            setLoading(false);
            navigation.goBack();
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 400) {
                Alert.alert(errorMessage);
            } else if (errorStatus == 401) {
                setLoading(false);
                logout(errorMessage);
            } else if (errorStatus == 403) {
                setLoading(false);
                Alert.alert('Forbidden request', errorMessage);
            } else if (errorStatus == 404) {
                setLoading(false);
                Alert.alert('Image not found', errorMessage);
            } else if (errorStatus == 500) {
                Alert.alert("Failed to upload image");
                console.log("Error uploading image: ", errorMessage);
            }
            setLoading(false);
        })
    }

    return (
            <View style={styles.container}>
            <ScrollView>
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
                : <UserSubmitButton buttonName='Edit' onPress={handleSubmit(editDescription)} />}
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
})