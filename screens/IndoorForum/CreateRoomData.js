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
            console.log('Room data creation success');
            setLoading(false);
            navigation.goBack();
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            setLoading(false);
            if (errorStatus == 400) {
                Alert.alert(errorMessage);
            } else if (errorStatus == 500) {
                Alert.alert("An error occurred while creating room");
                console.log("Error creating room: ", errorMessage);
            }
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
})