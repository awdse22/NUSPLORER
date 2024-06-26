import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default function AddDataButton({label, onPress}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Text style={styles.buttonText}> {label} </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        backgroundColor: '#2164cf',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 7,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16, 
        color: 'white'
    }
})