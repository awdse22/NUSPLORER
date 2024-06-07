import {React, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen() {
    const [username, setUsername] = useState('No data');
    const [email, setEmail] = useState('No data');
    const [errorVisible, setErrorVisible] = useState(false);

    async function getUserDetails() {
        const url = 'http://10.0.2.2:3000/userdetails';
        const token = await AsyncStorage.getItem('token');

        axios.post(url, {token: token}).then((response) => {
            const result = response.data;
            if (result.success) {
                setEmail(result.userData.email);
                setUsername(result.userData.username)
            } else {
                setErrorVisible(true);
                console.log(result.message)
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
            {errorVisible && <Text>No data found!</Text>}
            <Button title='Get user details' onPress={getUserDetails} />
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