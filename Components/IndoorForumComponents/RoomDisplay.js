import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function RoomDisplay({roomData}) {
    // room data should be a json object
    return (
        <View style={styles.container}>
            <Text>{roomData.roomCode}</Text>
            <Text>Building: {roomData.buildingName}</Text>
            <Text>Floor: {roomData.floorNumber}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        margin: 1,
    }
})