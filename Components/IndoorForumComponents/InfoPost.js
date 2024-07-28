import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import VotesDisplay from './VotesDisplay';
import OptionsModal from './OptionsModal';
import ReportModal from './ReportModal';

export default function InfoPost({ postDetails, refreshPage }) {
    const navigation = useNavigation();
    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const { _id, roomId, title, content, creator, voteCount, userVote, sameUser } = postDetails;
    const postCreatedAt = new Date(postDetails.createTime).toLocaleDateString();
    const postIsModified = postDetails.modifyTime != null;
    const postLastModifiedAt = postIsModified ? new Date(postDetails.modifyTime).toLocaleDateString() : null;

    function logout(errorMessage) {
        Alert.alert(errorMessage, 'Please login again!', [
            {
                text: 'OK',
                onPress: () => {
                    AsyncStorage.removeItem('token');
                    navigation.navigate('Login');
                    console.log('Token cleared and navigated to Login');
                }
            }
        ])
    };

    async function updateVote(initialVoteValue, updatedVoteValue) {
        const token = await AsyncStorage.getItem('token');
        const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts/${_id}/vote`;
        console.log(`Updating vote from ${initialVoteValue} to ${updatedVoteValue} roomId: ${roomId} , postId: ${_id}`); // delete this entire line later

        try {
            await axios.put(url, 
                { initialVoteValue, updatedVoteValue }, 
                {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : null
                }
            });
            return true;
        } catch (error) {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 401 || errorStatus == 403) {
                logout(errorMessage);
            } else if (errorStatus == 400) {
                Alert.alert(
                    'Bad request',
                    `There is an issue with the request to update your vote for post "${title}", please try again.`
                );
            } else if (errorStatus == 404) {
                Alert.alert(
                    'Post not found', 
                    errorMessage,
                    [{ text: 'OK', onPress: () => refreshPage() }]
                );
            } else if (errorStatus == 500) {
                Alert.alert(
                    'Failed to update vote', 
                    'An error occurred in the server while updating vote'
                );
            } else {
                Alert.alert(
                    'Failed to update vote',
                    'An unknown error occurred while updating vote'
                )
            }
            console.log(`Error updating vote for post ${_id}: `, error.message);
            return false;
        }
    }

    async function editPost() {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            logout('Unauthorized request');
            return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        if (userId == creator._id) {
            setOptionsModalOpen(false);
            navigation.navigate('Create Post', {
                roomId: roomId,
                mode: 'Edit',
                editParams: {
                    postId: _id,
                    title: title,
                    content: content
                }
            });
        } else {
            Alert.alert('Forbidden request', 'You do not have the permission to edit this post!');
        }
    }

    function deletePostConfirmation() {
        Alert.alert(
            'Deleting post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deletePost() }
            ]
        );
    }

    async function deletePost() {
        const token = await AsyncStorage.getItem('token');
        const url = `https://nusplorer.onrender.com/rooms/${roomId}/posts/${_id}`;

        axios.delete(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then(response => {
            const postTitle = response.data.title;
            Alert.alert('Post deleted', `Your post "${postTitle}" has been deleted successfully`);
            setOptionsModalOpen(false);
            refreshPage();
        }).catch(error => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 401) {
                setOptionsModalOpen(false);
                logout(errorMessage);
            } else if (errorStatus == 403) {
                Alert.alert('Forbidden request', errorMessage);
            } else if (errorStatus == 404) {
                Alert.alert(
                    'Post not found', 
                    errorMessage,
                    [{ text: 'OK', onPress: () => refreshPage() }]
                );
            } else if (errorStatus == 500) {
                Alert.alert(
                    'Failed to delete post', 
                    'An error occurred in the server while deleting post'
                );
            } else {
                Alert.alert(
                    'Failed to delete post',
                    'An unknown error occurred while deleting post'
                )
            }
            console.log('Error deleting post: ', errorMessage);
        })
    }

    function makeReport() {
        setOptionsModalOpen(false);
        setReportModalOpen(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.postDetails.container}>
                <View style={styles.postDetails.titleContainer}>
                    <Text style={styles.postDetails.titleText}>{title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <VotesDisplay 
                            voteValue={userVote} 
                            numberOfVotes={voteCount} 
                            onVoteChange={updateVote}
                        />
                        <TouchableOpacity onPress={() => setOptionsModalOpen(true)}>
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.postDetails.usernameText}>
                        by {creator.username}
                    </Text>
                    <Text style={styles.postDetails.dateText}>
                        {postIsModified ? `Last modified: ${postLastModifiedAt}`
                            : `Created at ${postCreatedAt}`
                        }
                    </Text>
                </View>
            </View>
            <Text style={styles.postContent}>{content}</Text>
            <OptionsModal 
                modalVisible={optionsModalOpen}
                closeModal={() => setOptionsModalOpen(false)}
                contentType='post'
                makeReport={makeReport}
                editFunction={sameUser ? editPost : null}
                deleteFunction={sameUser ? deletePostConfirmation : null}
            />
            <ReportModal 
                modalVisible={reportModalOpen} 
                closeModal={() => setReportModalOpen(false)}
                contentId={postDetails._id}
                contentType='post'
                refreshPage={refreshPage}
            />
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderRadius: 12,
        borderColor: 'grey',
        flexDirection: 'column',
        padding: 5,
    },
    postDetails: {
        container: {
            flexDirection: 'column',
            paddingLeft: 10,
            paddingTop: 8,
            paddingBottom: 0,
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 12,
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 19,
            flex: 1,
            paddingRight: 10,
        },
        usernameText: {
            fontSize: 16
        },
        dateText: {
            fontSize: 13,
            color: 'grey',
        }
    },
    postContent: {
        fontSize: 15,
        padding: 10
    },
})