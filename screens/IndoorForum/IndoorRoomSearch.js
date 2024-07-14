import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IndoorSearchBar from '../../Components/IndoorForumComponents/IndoorSearchBar';
import RoomDisplay from '../../Components/IndoorForumComponents/RoomDisplay';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';

export default function IndoorRoomSearch() {
  const navigation = useNavigation();
  const [roomList, setRoomList] = useState([]);
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const fetchRooms = async () => {
    // const url = `https://nusplorer.onrender.com/rooms?page=${pageNumber}&pageSize=10&keyword=${query}`;
    const url = `http://10.0.2.2:3000/rooms?page=${pageNumber}&pageSize=10&keyword=${query}`;
    const token = await AsyncStorage.getItem('token');

    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        setTotalPages(response.data.numberOfPages);
        setRoomList(response.data.list);
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        console.log('Error fetching data: ', error.message);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <IndoorSearchBar label="Search rooms" onChange={setQuery} />
      <View style={styles.createRoomContainer}>
        <AddDataButton
          label="Create new room data"
          onPress={() => navigation.navigate('Create Room Data')}
        />
      </View>
      <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />
      {roomList.length == 0 && (
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>No data found</Text>
      )}
      <ScrollView>
        <View style={styles.roomDisplayWrapper}>
          {roomList.map((room) => (
            <RoomDisplay key={room._id} roomData={room} onBookmarkedChange={fetchRooms} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    alignItems: 'center',
  },
});
