import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRooms = async () => {
    // const url = `https://nusplorer.onrender.com/rooms?page=${pageNumber}&pageSize=10&keyword=${query}`;
    const url = `http://10.0.2.2:3000/rooms?page=${pageNumber}&pageSize=10&keyword=${query}`;
    const token = await AsyncStorage.getItem('token');
    setLoading(true);
    setErrorMessage('');
    setErrorMessageVisible(false);

    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        setTotalPages(response.data.numberOfPages);
        setRoomList(response.data.list);
        setLoading(false);
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        const errorMessage = error.response.data.error;
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
        } else if (errorStatus == 500) {
          setErrorMessage('An error occurred in the server while fetching room data');
          setErrorMessageVisible(true);
        } else {
          setErrorMessage('An unknown error occurred while fetching room data');
          setErrorMessageVisible(true);
        }
        console.log('Error fetching data: ', error.message);
        setRoomList([]);
        setLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms();
    }, [query, pageNumber]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <IndoorSearchBar 
        label="Search rooms" 
        onChange={val => {
          setPageNumber(1);
          setQuery(val);
        }} 
      />
      <View style={styles.createRoomContainer}>
        <AddDataButton
          label="Create new room data"
          onPress={() => navigation.navigate('Create Room Data')}
        />
      </View>
      <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />
      <ScrollView>
      {loading ? (
        <ActivityIndicator 
          animating={true}
          size='large'
          color='#003db8'
        />
      ) : (
        <View>
          {roomList.length == 0 && (
            errorMessageVisible ? (
              <Text style={[styles.noDataFound, { color: 'red' }]}>{errorMessage}</Text>
            ) : <Text style={styles.noDataFound}>No data found</Text>
          )}
          <View style={styles.roomDisplayWrapper}>
            {roomList.map((room) => (
              <RoomDisplay 
                key={room._id} 
                roomData={room} 
                refreshPage={fetchRooms}
              />
            ))}
          </View>
        </View>
      )}
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
  noDataFound: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
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
    paddingBottom: 0
  },
});
