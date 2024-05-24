import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Settings() {
    return (
        <View style={styles}>
            <Text>Settings</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'left'
    }
})