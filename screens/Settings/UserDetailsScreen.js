import {React, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function UserDetailsScreen() {
    const navigator = useNavigation();
    const [username, setUsername] = useState('No data');
    const [email, setEmail] = useState('No data');
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function logout() {
        AsyncStorage.removeItem('token');
        navigator.navigate('Login');
        console.log('token cleared');
    }

    async function getUserDetails() {
        const url = 'http://10.0.2.2:3000/userdetails';
        const token = await AsyncStorage.getItem('token');

        axios.get(url, { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            const userData = response.data.userData;
            setEmail(userData.email);
            setUsername(userData.username);
            setErrorVisible(false);
            setErrorMessage('');
        }).catch((error) => {
            const errorStatus = error.response.status;
            if (errorStatus == 401 || errorStatus == 403) {
                Alert.alert(error.response.data.message, 'Please login again!', [
                    {
                        text: 'OK',
                        onPress: () => logout()
                    }
                ])
            } else if (errorStatus == 404 || errorStatus == 500) {
                setErrorMessage(error.response.data.message);
                setErrorVisible(true);
            } else {
                console.error('Error in backend', error);
            }
        });
    }

    useEffect(() => {
        getUserDetails();
    })

    const InfoDisplay = ({info, label}) => {
        return (
            <View style={styles.detailContainer}>
                <Text style={styles.text}>{label}: {info}</Text>
            </View>
        )
    
    }

    return (
        <View style={styles.container}>
            {errorVisible && <Text>{errorMessage}</Text>}
            <InfoDisplay info={username} label='Username' />
            <InfoDisplay info={email} label='Email' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        height: '100%',
    },
    detailContainer: {
        backgroundColor: 'pink',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderWidth: 1,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
    }
})