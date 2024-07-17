import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportModal from '../../Components/IndoorForumComponents/ReportModal';

export default function RoomInformation({ route }) {
    const navigation = useNavigation();
    const { _id, roomCode, buildingName, floorNumber, roomName } = route.params;
    const [reportModalOpen, setReportModalOpen] = useState(false);

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

    function logout(errorMessage) {
        Alert.alert(errorMessage, 'Please login again!', [
            {
                text: 'OK',
                onPress: () => {
                    AsyncStorage.removeItem('token');
                    navigation.navigate('Login');
                    console.log('Token cleared and navigated to Login');
                }
            }
        ])
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.details.detailsContainer}>
                    <View style={styles.details.titleContainer}>
                        <Text style={styles.details.titleText}> Room Details </Text>
                        <TouchableOpacity style={styles.reportButtonContainer} onPress={() => setReportModalOpen(true)}>
                            <Text style={styles.reportButtonText}>Report</Text>
                        </TouchableOpacity>
                    </View>
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
                        text={`Room name: ${roomName}`}
                    />
                </View>
                <View style={styles.otherInfo.container}>
                    <InfoNavigation label='Entrance Photos' page='Images Page' />
                    <InfoNavigation label='Floor Plans/Maps' page='Images Page' />
                    <InfoNavigation label='Info/Directions' page='Information Posts Page' />
                </View>
            </ScrollView>
            <ReportModal 
                modalVisible={reportModalOpen}
                closeModal={() => setReportModalOpen(false)}
                contentId={_id}
                contentType='room'
                refreshPage={() => navigation.goBack()}
            />
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
        titleContainer: {
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '98%'
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 24,
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
    },
    reportButtonContainer: {
        width: 70,
        padding: 4,
        backgroundColor: '#2164cf',
        borderWidth: 0.5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    reportButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
})