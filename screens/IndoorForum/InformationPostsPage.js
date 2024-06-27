import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import InfoPost from '../../Components/IndoorForumComponents/InfoPost';
import PageSelector from '../../Components/IndoorForumComponents/PageSelector';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import samplePostData from '../../assets/samplePostData.json';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function InformationPostsPage({ route }) {
    const navigation = useNavigation();
    const { roomId, roomCode } = route.params;
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    useFocusEffect(
        React.useCallback(() => {
            // get posts data
            const fetchPosts = async () => {
            setPosts(samplePostData);
            }
            console.log(`Fetching posts data for ${roomCode} on page ${pageNumber}`);
            fetchPosts();
        }, [pageNumber])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>{roomCode} info</Text>
            <View style={styles.createPostContainer}>
                <AddDataButton label='Create post' onPress={() => navigation.navigate('Create Post', { roomId: roomId })} />
            </View>
            <PageSelector totalPages={totalPages} pageNumber={pageNumber} onPageChange={setPageNumber} />   
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
    }
})