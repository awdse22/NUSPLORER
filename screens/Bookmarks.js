import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RoomDisplay from '../Components/IndoorForumComponents/RoomDisplay';
import IndoorRoomSearch from './IndoorForum/IndoorRoomSearch';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [fetchingBookmarks, setFetchingBookmarks] = useState(false);

  async function fetchBookmarks() {
    const token = await AsyncStorage.getItem('token');
    const url = 'http://10.0.2.2:3000/bookmark';
    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        setBookmarks(response.data);
      })
      .catch((error) => {
        console.log('Error fetching data: ', error.message);
      });
  };

  async function removeBookmark(bookmarkId, roomId) {
    const token = await AsyncStorage.getItem('token');
    const url = `http://10.0.2.2:3000/bookmark/${bookmarkId}`;
    try {
      console.log(`Deleting bookmark ${bookmarkId}, room ${roomId}`)
      const deletedBookmark = await axios.delete(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
        data: { roomId: roomId }
      });
      if (deletedBookmark) {
        setBookmarks(prev => prev.filter(bm => bm._id !== deletedBookmark.data._id));
      }
      console.log(deletedBookmark.data);
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

    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarks();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data found</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.roomDisplayWrapper}>
            {bookmarks.map((bookmark) => (
              <RoomDisplay
                key={bookmark._id}
                roomData={{ ...bookmark.room, isBookmarked: true, bookmarkId: bookmark._id }}
                onBookmarkedChange={() => removeBookmark(bookmark._id, bookmark.room._id)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#d1fdff',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomDisplayWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
