import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

export default function RoomInformation({ route }) {
    const navigation = useNavigation();
    const { _id, roomCode, buildingName, floorNumber, roomAliases } = route.params;

    const RoomDetail = ({icon, text}) => {
        return (
            <View style={styles.details.roomDetailsContainer}>
                {icon}
                <Text style={styles.details.roomDetailsFont}>{text}</Text>
            </View>
        )
    }

    const InfoNavigation = ({label, page}) => {
        return (
            <View style={styles.otherInfo.titleContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.otherInfo.titleText}>{label}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate(page, { 
                    roomId: _id, 
                    roomCode: roomCode, 
                    dataType: label 
                })}>
                    <Text style={styles.otherInfo.viewMoreText}>View {'>>'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.details.detailsContainer}>
                    <Text style={styles.details.detailsText}> Room Details </Text>
                        <RoomDetail 
                            icon=<MaterialIcons name="meeting-room" size={36} color="black" />
                            text={`Room code: ${roomCode}`}
                        />
                        <RoomDetail 
                            icon=<MaterialCommunityIcons name="office-building-marker" size={36} color="black" />
                            text={`Building name: ${buildingName}`}
                        />
                        <RoomDetail 
                            icon=<MaterialCommunityIcons name="layers" size={36} color="black" />
                            text={`Floor: ${floorNumber}`}
                        />
                        <RoomDetail 
                            icon=<MaterialIcons name="label" size={36} color="black" />
                            text={`Room name${roomAliases.length > 1 ? 's' : ''}: ${roomAliases.join(', ')}`}
                        />
                </View>
                <View style={styles.otherInfo.container}>
                    <InfoNavigation label='Entrance Photos' page='Images Page' />
                    <InfoNavigation label='Floor Plans/Maps' page='Images Page' />
                    <InfoNavigation label='Info/Directions' page='Information Posts Page' />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d1fdff',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        padding: 8,
        justifyContent: 'center',
    },
    details: {
        detailsContainer: {
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e8e8e8',
            padding: 10,
            flexDirection: 'column',
            marginBottom: 5,
        },
        detailsText: {
            fontWeight: 'bold',
            fontSize: 24,
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
        },
        roomDetailsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            paddingRight: 20,
        },
        roomDetailsFont: {
            fontSize: 17,
            marginLeft: 2,
        }
    },
    otherInfo: {
        container: {
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e8e8e8',
        },
        titleContainer: {
            padding: 5,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 22,
            paddingLeft: 10,
        },
        viewMoreText: {
            color: '#2164cf',
            fontSize: 20,
            fontWeight: 'bold',
            paddingTop: 2,
            paddingRight: 4,
            justifyContent: 'center'
        },
    }
})