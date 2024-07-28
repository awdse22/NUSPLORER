import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoomDisplay({ roomData, refreshPage, onBookmarkedChange = null }) {
  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(roomData.isBookmarked);
  const [bookmarkId, setBookmarkId] = useState(roomData.bookmarkId);
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
          data: { roomId: roomData._id }
        });
        setBookmarkId(null);
      } else {
        const response = await axios.post(
          'https://nusplorer.onrender.com/bookmark',
          { roomId: roomData._id },
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

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Room Information', {
          ...roomData,
          isBookmarked,
          bookmarkId
        })}
      >
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.roomDetailsContainer}>
              <MaterialCommunityIcons name="layers" size={26} color="black" />
              <Text style={styles.roomDetailsFont} numberOfLines={1} ellipsizeMode="tail">
                {' '}
                Floor: {roomData.floorNumber}
              </Text>
            </View>
            <View>
              {loading ? (
                <ActivityIndicator 
                  animating={true}
                  size='small'
                  color='#003db8'
                />
              ) : (
                <TouchableOpacity onPress={onBookmarkedChange ? onBookmarkedChange : updateBookmarkStatus}>
                  <MaterialCommunityIcons name="heart" size={26} color={isBookmarked ? 'red' : 'grey'} />
                </TouchableOpacity>
              )}
            </View>
          </View>
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
