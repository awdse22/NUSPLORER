import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function TimetableScreen() {
    return (
        <View style={styles}>
            <Text>Timetable</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'left'
    }
})