import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import InfoPost from '../../Components/IndoorForumComponents/InfoPost';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function InformationPostsPage({ route }) {
    const navigation = useNavigation();
    const { roomId, roomCode } = route.params;
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState(''); // search query, not implemented
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    useFocusEffect(React.useCallback(() => {
        const fetchPosts = async () => {
            // const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;
            const url = `http://10.0.2.2:3000/rooms/${roomId}/posts?page=${pageNumber}&pageSize=10&keyword=${query}`;

            axios.get(url).then((response) => {
                setTotalPages(response.data.numberOfPages);
                setPosts(response.data.list);
            }).catch((error) => {
                const errorStatus = error.response.status;
                console.error('Error fetching data: ', error.message);
            })
        }
        console.log(`Fetching posts data for ${roomCode} on page ${pageNumber}`);
        fetchPosts();
    }, [pageNumber]));

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>{roomCode} info</Text>
            <View style={styles.createPostContainer}>
                <AddDataButton label='Create post' onPress={() => navigation.navigate('Create Post', { roomId: roomId })} />
            </View>
            <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />   
            {posts.length == 0 && (
                <Text style={styles.noInformation}>
                    There are no posts of any information currently
                </Text>
            )}
            <ScrollView>
                {posts.map((post) => <InfoPost key={post._id} postDetails={post} />)}
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
    noInformation: {
        textAlign: 'center', 
        fontSize: 16, 
        fontWeight: 'bold',
        margin: 10,
    }
})