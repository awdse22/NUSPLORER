import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IndoorSearchBar from '../../Components/IndoorForumComponents/IndoorSearchBar';
import RoomDisplay from '../../Components/IndoorForumComponents/RoomDisplay';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import sampleRoomData from '../../assets/sampleRoomData.json';

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
            <View style={styles.createRoomContainer}>
                <AddDataButton label='Create new room data' onPress={() => navigation.navigate('Create Room Data')} />
            </View>
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
        backgroundColor: '#d1fdff',
    },
    roomDisplayWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    createRoomContainer: {
        padding: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})