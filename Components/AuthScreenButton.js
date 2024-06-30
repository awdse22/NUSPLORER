import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

export default function AuthScreenButton({ onPress, buttonName }) {

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.button}>
                <Text style={styles.text}>{buttonName}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#2164cf',
        borderRadius: 12,
        width: 225,
        padding: 10,
        margin: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})