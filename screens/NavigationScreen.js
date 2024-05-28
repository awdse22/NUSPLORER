import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function NavigationScreen() {
    return (
        <View style={styles}>
            <Text>Navigation Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'left'
    }
})