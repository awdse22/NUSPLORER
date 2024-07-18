import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreatePost({ route }) {
    const navigation = useNavigation();
    const { roomId, mode, editParams = null } = route.params;
    const {control, handleSubmit, setValue, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (mode == 'Edit' && editParams) {
            setValue('title', editParams.title);
            setValue('content', editParams.content);
        }
    }, [mode, editParams])

    async function createPost(post) {
        console.log(post);
        const token = await AsyncStorage.getItem('token');
        // const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts`;
        const url = `http://10.0.2.2:3000/rooms/${roomId}/posts`;
        setLoading(true);
        
        axios.post(url, post, { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            setLoading(false);
            Alert.alert('Post created successfully!');
            navigation.goBack();
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 400) {
                Alert.alert(errorMessage);
            } else if (errorStatus == 500) {
                Alert.alert("An error occurred while creating post");
                console.log("Error creating post: ", errorMessage);
            }
            setLoading(false);
        })
    }

    async function editPost(post) {
        console.log(post);
        const token = await AsyncStorage.getItem('token');
        // const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts`;
        const url = `http://10.0.2.2:3000/rooms/${roomId}/posts/${editParams.postId}`;
        setLoading(true);
        
        axios.put(url, post, { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            setLoading(false);
            Alert.alert('Post edited successfully!');
            navigation.goBack();
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 400) {
                Alert.alert('Bad request', errorMessage);
            } else if (errorStatus == 401) {
                logout(errorMessage);
            } else if (errorStatus == 403) {
                Alert.alert('Forbidden request', errorMessage)
            } else if (errorStatus == 500) {
                Alert.alert("An error occurred while editing post");
                console.log("Error editing post: ", errorMessage);
            }
            setLoading(false);
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <UserInput 
                    type='post'
                    label='Title' 
                    fieldName='title'
                    info='What your post is about'
                    control={control}
                    rules={{ 
                        required: 'You need a title',
                        maxLength: {
                            value: 50,
                            message: 'The title is too long!'
                        }
                    }} 
                />
                <UserInput 
                    type='post'
                    label='Content' 
                    fieldName='content'
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
                {loading ? <ActivityIndicator animating={true} size='large' color='#003db8' /> 
                    : mode == 'Edit'
                    ? <UserSubmitButton buttonName='Edit' onPress={handleSubmit(editPost)} />
                    : <UserSubmitButton buttonName='Post' onPress={handleSubmit(createPost)} />}
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