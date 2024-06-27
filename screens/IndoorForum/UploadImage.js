import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IndoorDataInput from '../../Components/IndoorForumComponents/IndoorDataInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

export default function UploadImage({ route }) {
    const navigation = useNavigation();
    const { roomId, dataType } = route.params;
    const {control, handleSubmit, formState: {errors}} = useForm();

    function uploadImage(info) {
        console.log(info);
        // send request to backend to create room
        const url = 'INSERT BACKEND URL HERE'
        
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <IndoorDataInput 
                    type='post'
                    label='Upload Image' 
                    fieldName='image'
                    info='Write about things to look out for when finding the room, or general directions!'
                    control={control}
                    rules={{ 
                        required: 'You need to put in content',
                        maxLength: {
                            value: 500,
                            message: 'The content is too long!'
                        }
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