import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserSubmitButton({ onPress, buttonName = 'Submit'}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.submitButton}>
                    <Text style={styles.submitButtonText}> {buttonName} </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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