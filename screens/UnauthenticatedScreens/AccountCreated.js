import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AuthScreenButton from '../../Components/AuthScreenButton';
import { useNavigation } from '@react-navigation/native';

export default function AccountCreated() {
    const navigator = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.displayText}>Account created successfully!</Text>
            <AuthScreenButton buttonName='Return to login' onPress={() => navigator.navigate('Login')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'pink',
        justifyContent: 'center',
        padding: 20
    },
    displayText: {
        fontWeight: 'bold',
        fontSize: 22,
    }
})