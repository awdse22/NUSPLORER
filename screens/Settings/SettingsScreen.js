import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const SettingsButton = ({ name, onPress }) => {
    return (
        <View style={styles.settingsButton}>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.settingsButtonText}>{name}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function SettingsScreen() {
    const navigator = useNavigation();

    return (
        <View style={styles.container}>
            <SettingsButton name='User Details' onPress={() => navigator.navigate('User Details')} />
            <SettingsButton name='Change password' onPress={() => navigator.navigate('Change Password')} />
            <SettingsButton name='Manage user data' onPress={() => navigator.navigate('Manage User Data')} />
            <SettingsButton name='Logout' onPress={() => navigator.navigate('Login')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        height: '100%',
        width: '100%',
    },
    settingsButton: {
        borderBottomWidth: 1,
        padding: 10,
    },
    settingsButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})