import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreatePost({ route }) {
    const navigation = useNavigation();
    const { roomId } = route.params;
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);

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
            console.log('Post created');
            setLoading(false);
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