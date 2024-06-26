import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IndoorDataInput from '../../Components/IndoorForumComponents/IndoorDataInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

export default function CreateRoomData() {
    const navigation = useNavigation();
    const {control, handleSubmit, formState: {errors}} = useForm();

    function createRoom(info) {
        console.log(info);
        // send request to backend to create room
        const url = 'INSERT BACKEND URL HERE'
        
        navigation.navigate('Indoor Room Search');
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <IndoorDataInput 
                    label='Room Code' 
                    fieldName='roomCode'
                    info='e.g. LT17, COM1-0201'
                    control={control}
                    rules={{ required: 'Please enter the room code' }} />
                <IndoorDataInput 
                    label='Building name' 
                    fieldName='buildingName'
                    info='e.g. LT17, COM1, AS3'
                    control={control}
                    rules={{ required: 'Please enter the building name' }} />
                <IndoorDataInput 
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
                <IndoorDataInput 
                    label='Room name' 
                    fieldName='roomName'
                    info='e.g. Lecture Theatre 17, Seminar Room 5, Programming Lab 2'
                    control={control}
                    rules={{ required: 'Please enter a room name' }} />

                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={handleSubmit(createRoom)}>
                        <View style={styles.submitButton}>
                            <Text style={styles.submitButtonText}> Create </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: '#ffeded',
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
        backgroundColor: '#75bcff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 20, 
    }
})