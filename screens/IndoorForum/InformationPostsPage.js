import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import InfoPost from '../../Components/IndoorForumComponents/InfoPost';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InformationPostsPage({ route }) {
  const navigation = useNavigation();
  const { roomId, roomCode } = route.params;
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState(''); // search query, not implemented
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  function logout(errorMessage) {
    Alert.alert(errorMessage, 'Please login again!', [
      {
        text: 'OK',
        onPress: () => {
          AsyncStorage.removeItem('token');
          navigation.navigate('Login');
          console.log('Token cleared and navigated to Login');
        },
      },
    ]);
  }

  async function fetchPosts() {
    const token = await AsyncStorage.getItem('token');
    // const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;
    const url = `http://10.0.2.2:3000/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;
    console.log(`Fetching posts data for ${roomCode} on page ${pageNumber}`);

    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        setTotalPages(response.data.numberOfPages);
        setPosts(response.data.postsWithUserVoteInfo);
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        if (errorStatus == 401 || errorStatus == 403) {
          logout(error.response.data.message);
        } else {
          console.error('Error fetching data: ', error.message);
        }
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [pageNumber]),
  );

  async function updateVote(postId, initialVoteValue, updatedVoteValue) {
    const token = await AsyncStorage.getItem('token');
    const url = `http://10.0.2.2:3000/rooms/${roomId}/posts/${postId}/vote`;
    console.log(`roomId: ${roomId} , postId: ${postId}`); // delete this entire line later

    try {
      const response = await axios.put(
        url,
        { initialVoteValue, updatedVoteValue },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : null,
          },
        },
      );
      return true;
    } catch (error) {
      const errorStatus = error.response.status;
      if (errorStatus == 401 || errorStatus == 403) {
        logout(error.response.data.message);
      } else {
        Alert.alert('Failed to update vote');
        console.error(`Error updating vote for ${postId}: `, error.message);
      }
      return false;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>{roomCode} info</Text>
      <View style={styles.createPostContainer}>
        <AddDataButton
          label="Create post"
          onPress={() => navigation.navigate('Create Post', { roomId: roomId })}
        />
      </View>
      <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />
      {posts.length == 0 && (
        <Text style={styles.noInformation}>There are no posts of any information currently</Text>
      )}
      <ScrollView>
        {posts.map((post) => (
          <InfoPost
            key={post._id}
            postDetails={post}
            voteUpdater={updateVote}
            refreshPage={fetchPosts}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 26,
    paddingLeft: 10,
  },
  createPostContainer: {
    padding: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInformation: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
  },
});
