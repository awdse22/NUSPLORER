import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RoomDisplay({roomData}) {
    const navigation = useNavigation();
    // room data should be a json object
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Room Information', roomData)} >
                <View style={styles.contentBox}>
                    <Text style={styles.roomCodeFont} numberOfLines={1} ellipsizeMode='tail'>{roomData.roomCode}</Text>
                    <View style={styles.roomDetailsContainer}>
                        <MaterialCommunityIcons name="office-building-marker" size={28} color="black" />
                        <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode='tail'>{roomData.buildingName}</Text>
                    </View>
                    <View style={styles.roomDetailsContainer}>
                        <MaterialCommunityIcons name="layers" size={26} color="black" />
                        <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode='tail'> Floor: {roomData.floorNumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 2,
    },
    contentBox: {
        borderWidth: 1.5,
        borderRadius: 5,
        padding: 4,
        backgroundColor: 'white'
    },
    roomDetailsContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingRight: 22,
    },
    roomCodeFont: {
        fontWeight: 'bold',
        fontSize: 22,
        margin: 2,
    },
    roomDetailsFont: {
        fontSize: 16,
        marginLeft: 1,
    }
})