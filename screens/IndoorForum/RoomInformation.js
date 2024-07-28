import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import OptionsModal from '../../Components/IndoorForumComponents/OptionsModal';
import ReportModal from '../../Components/IndoorForumComponents/ReportModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoomInformation({ route }) {
    const navigation = useNavigation();
    const { _id, roomCode, buildingName, floorNumber, roomName } = route.params;
    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(route.params.isBookmarked);
    const [bookmarkId, setBookmarkId] = useState(route.params.bookmarkId);
    const [loading, setLoading] = useState(false);

    async function updateBookmarkStatus() {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (isBookmarked) {
                await axios.delete(`https://nusplorer.onrender.com/bookmark/${bookmarkId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : null,
                },
                data: { roomId: _id }
                });
                setBookmarkId(null);
            } else {
                const response = await axios.post(
                'https://nusplorer.onrender.com/bookmark',
                { roomId: _id },
                {
                    headers: {
                    Authorization: token ? `Bearer ${token}` : null,
                    },
                },
                );
                setBookmarkId(response.data._id);
            }
            setIsBookmarked(prev => !prev);
            setLoading(false);
        } catch (error) {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            let actionString = isBookmarked ? 'remove' : 'add';

            if (errorStatus == 401 || errorStatus == 403) {
                Alert.alert(errorMessage, 'Please login again!', [
                {
                    text: 'OK',
                    onPress: () => {
                    AsyncStorage.removeItem('token');
                    navigation.navigate('Login');
                    console.log('Token cleared and navigated to Login');
                    }
                }
                ]);
            } else if (errorStatus == 404) {
                Alert.alert('Data not found', errorMessage, [
                {
                    text: 'Refresh',
                    onPress: () => refreshPage()
                }
                ]);
            } else if (errorStatus == 500) {
                Alert.alert(
                `Failed to ${actionString} bookmark`,
                `An error occurred in the server while trying to ${actionString} bookmark`
                );
            } else {
                Alert.alert(
                `Failed to ${actionString} bookmark`,
                `An unknown error occurred while trying to ${actionString} bookmark`
                );
            }
            setLoading(false);
        }
    };

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

    function makeReport() {
        setOptionsModalOpen(false);
        setReportModalOpen(true);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.details.detailsContainer}>
                    <View style={styles.details.titleContainer}>
                        <Text style={styles.details.titleText}> Room Details </Text>
                        <View style={{ flexDirection: 'row'}}>
                            {loading ? (
                                <ActivityIndicator 
                                animating={true}
                                size='small'
                                color='#003db8'
                                />
                            ) : (
                                <TouchableOpacity onPress={updateBookmarkStatus}>
                                <MaterialCommunityIcons name="heart" size={26} color={isBookmarked ? 'red' : 'grey'} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => setOptionsModalOpen(true)}>
                                <Ionicons 
                                    name="ellipsis-vertical" 
                                    size={26} 
                                    color="black" 
                                    style={{ padding: 2, marginBottom: 4 }}
                                    />
                            </TouchableOpacity>
                        </View>
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
            <OptionsModal 
                modalVisible={optionsModalOpen}
                closeModal={() => setOptionsModalOpen(false)}
                makeReport={makeReport}
            />
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