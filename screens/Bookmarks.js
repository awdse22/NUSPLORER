import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import RoomDisplay from '../Components/IndoorForumComponents/RoomDisplay';
import IndoorSearchBar from '../Components/IndoorForumComponents/IndoorSearchBar';

export default function Bookmarks() {
  const navigation = useNavigation();
  const [bookmarks, setBookmarks] = useState([]);
  const [fetchingBookmarks, setFetchingBookmarks] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(bm => {
    return bm.room.roomCode.toLowerCase().includes(query.toLowerCase());
  });

  async function fetchBookmarks() {
    const token = await AsyncStorage.getItem('token');
    const url = 'https://nusplorer.onrender.com/bookmark';
    setFetchingBookmarks(true);

    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        setBookmarks(response.data);
        setFetchingBookmarks(false);
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
        setBookmarks([]);
        setFetchingBookmarks(false);
      });
  };

  async function removeBookmark(bookmarkId, roomId) {
    const token = await AsyncStorage.getItem('token');
    const url = `https://nusplorer.onrender.com/bookmark/${bookmarkId}`;
    setFetchingBookmarks(true);
    try {
      const deletedBookmark = await axios.delete(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
        data: { roomId: roomId }
      });
      if (deletedBookmark) {
        setBookmarks(prev => prev.filter(bm => bm._id !== deletedBookmark.data._id));
        setFetchingBookmarks(false);
      }
    } catch (error) {
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
      } else if (errorStatus == 404) {
        Alert.alert('Data not found', errorMessage, [
          {
            text: 'Refresh',
            onPress: () => fetchBookmarks()
          }
        ]);
      } else if (errorStatus == 500) {
        Alert.alert(
          `Failed to remove bookmark`,
          `An error occurred in the server while trying to remove bookmark`
        );
      } else {
        Alert.alert(
          `Failed to remove bookmark`,
          `An unknown error occurred while trying to remove bookmark`
        );
      }
      setFetchingBookmarks(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarks();
      setQuery('');
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <IndoorSearchBar 
        label="Search bookmarks" 
        onChange={setQuery} 
      />
      {fetchingBookmarks ? (
        <ActivityIndicator 
          animating={true}
          size='large'
          color='#003db8'
        />
      ) : (
        <View>
          {filteredBookmarks.length == 0 && (
            errorMessageVisible ? (
              <Text style={[styles.noDataFound, { color: 'red' }]}>{errorMessage}</Text>
            ) : <Text style={styles.noDataFound}>No data found</Text>
          )}
          <ScrollView>
            <View style={styles.roomDisplayWrapper}>
              {filteredBookmarks.map((bookmark) => (
                <RoomDisplay
                  key={bookmark._id}
                  roomData={{ ...bookmark.room, isBookmarked: true, bookmarkId: bookmark._id }}
                  onBookmarkedChange={() => removeBookmark(bookmark._id, bookmark.room._id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1fdff',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataFound: {
    paddingTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  roomDisplayWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
