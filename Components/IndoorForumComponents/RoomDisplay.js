import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoomDisplay({ roomData, onBookmarkedChange }) {
  const navigation = useNavigation();
  const isBookmarked = roomData.isBookmarked;

  const updateBookmarkStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (isBookmarked) {
        await axios.delete(`http://10.0.2.2:3000/bookmark/${roomData.bookmarkId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : null,
          },
        });
      } else {
        await axios.post(
          'http://10.0.2.2:3000/bookmark',
          { roomId: roomData._id },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : null,
            },
          },
        );
      }
      if (onBookmarkedChange) {
        onBookmarkedChange(!isBookmarked);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Room Information', roomData)}>
        <View style={styles.contentBox}>
          <Text style={styles.roomCodeFont} numberOfLines={1} ellipsizeMode="tail">
            {roomData.roomCode}
          </Text>
          <View style={styles.roomDetailsContainer}>
            <MaterialCommunityIcons name="office-building-marker" size={28} color="black" />
            <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode="tail">
              {roomData.buildingName}
            </Text>
          </View>
          <View style={styles.roomDetailsContainer}>
            <MaterialCommunityIcons name="layers" size={26} color="black" />
            <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode="tail">
              {' '}
              Floor: {roomData.floorNumber}
            </Text>
          </View>
          <TouchableOpacity style={styles.roomDetailsContainer} onPress={updateBookmarkStatus}>
            <MaterialCommunityIcons name="heart" size={26} color={isBookmarked ? 'red' : 'black'} />
            <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode="tail">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 2,
  },
  contentBox: {
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 4,
    backgroundColor: 'white',
  },
  roomDetailsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingRight: 22,
  },
  roomCodeFont: {
    fontWeight: 'bold',
    fontSize: 22,
    margin: 2,
  },
  roomDetailsFont: {
    fontSize: 16,
    marginLeft: 1,
  },
});
