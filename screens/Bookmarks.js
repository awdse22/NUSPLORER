import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RoomDisplay from '../Components/IndoorForumComponents/RoomDisplay';
import IndoorRoomSearch from './IndoorForum/IndoorRoomSearch';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
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
                roomData={{ ...bookmark.roomId, isBookmarked: true, bookmarkId: bookmark._id }}
                onBookmarkedChange={fetchBookmarks}
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
