import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Alert, ActivityIndicator } from 'react-native';
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
    const [totalPages, setTotalPages] = useState(1);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function fetchPosts() {
        const token = await AsyncStorage.getItem('token');
        // const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;
        const url = `http://10.0.2.2:3000/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;
        setLoadingPosts(true);
        setErrorMessageVisible(false);
        setErrorMessage('');
        console.log(`Fetching posts data for ${roomCode} on page ${pageNumber}`);

        axios.get(url, { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            setTotalPages(response.data.numberOfPages);
            setPosts(response.data.postsWithUserVoteInfo);
            setLoadingPosts(false);
        }).catch((error) => {
            const errorStatus = error.response.status;
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
                setErrorMessage('An error occurred in the server while fetching posts');
                setErrorMessageVisible(true);
            } else {
                setErrorMessage('An unknown error occurred while fetching posts');
                setErrorMessageVisible(true);
            }
            console.log('Error fetching data: ', error.message);
            setLoadingPosts(false);
        })
    }

    useFocusEffect(React.useCallback(() => {
        fetchPosts();
    }, [pageNumber]));

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>{roomCode} info</Text>
            <View style={styles.createPostContainer}>
                <AddDataButton 
                    label='Create post' 
                    onPress={() => navigation.navigate('Create Post', { 
                        roomId: roomId, 
                        mode: 'Create'
                    })} 
                />
            </View>
            <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />
            <ScrollView>
                {loadingPosts ? (
                    <ActivityIndicator 
                        animating={true}
                        size='large'
                        color='#003db8'
                    />
                ) : (
                    <View>
                        {posts.length == 0 && (
                            errorMessageVisible ? (
                                <Text style={[styles.noDataFound, { color: 'red' }]}>{errorMessage}</Text>
                            ) : (
                                <Text style={styles.noDataFound}>
                                    There are no posts of any information currently
                                </Text>
                            )
                        )}
                        {posts.map((post) => (
                            <InfoPost 
                                key={post._id} 
                                postDetails={post} 
                                refreshPage={fetchPosts} 
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
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
        alignItems: 'center'
    },
    noDataFound: {
        textAlign: 'center', 
        fontSize: 16, 
        fontWeight: 'bold',
        margin: 10,
    }
})