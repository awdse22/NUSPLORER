import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IndoorSearchBar from '../../Components/IndoorForumComponents/IndoorSearchBar';
import RoomDisplay from '../../Components/IndoorForumComponents/RoomDisplay';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import sampleRoomData from '../../assets/sampleRoomData.json';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function IndoorRoomSearch() {
    const navigation = useNavigation();
    const [roomList, setRoomList] = useState([]);
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    // MAY NEED TO REMOVE THIS WHEN INTEGRATING BACKEND
    const filteredRoomList = roomList.filter((room) => {
        return room.roomCode.toLowerCase().includes(query.toLowerCase());
    })

    const CreateRoomDataButton = () => {
        return (
            <View style={styles.createRoomContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Create Room Data')}>
                    <View style={styles.createRoomButton}>
                        <Text style={styles.buttonText}> Create new room data </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        const fetchRooms = async () => {
            // insert backend query here with axios.get
            // Format for each room should be in json format based on mongodb schema
            // and use setRoomList to update the state
            console.log('Fetching room data');
            setRoomList(sampleRoomData)
        }

        fetchRooms();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <IndoorSearchBar label='Search rooms' onChange={setQuery} />
            <CreateRoomDataButton />
            <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />
            {roomList.length == 0 && (
                <Text>No data found</Text>
            )}
            <ScrollView>
                <View style={styles.roomDisplayWrapper}>
                    {filteredRoomList.map((room) => (
                        <RoomDisplay key={room._id} roomData={room} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 20,
        justifyContent: 'left',
        flexDirection: 'column',
        backgroundColor: '#ffeded',
    },
    roomDisplayWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    createRoomContainer: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    createRoomButton: {
        borderRadius: 6,
        backgroundColor: '#75bcff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20, 
    }
})