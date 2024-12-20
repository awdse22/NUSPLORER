import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Modal, Image, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import VotesDisplay from '../../Components/IndoorForumComponents/VotesDisplay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';
import OptionsModal from './OptionsModal';
import ReportModal from './ReportModal';

const { width, height } = Dimensions.get('screen');

function clamp(value, min, max) {
    // used to make sure value is bound between min and max
    return Math.min(Math.max(value, min), max);
}

export default function ImageDisplay({ imageData, refreshPage }) {
    const navigation = useNavigation();
    const [viewingImage, setViewingImage] = useState(false);
    const { _id, uri, roomId, description, creator, createTime, sameUser } = imageData;
    const [userVote, setUserVote] = useState(imageData.userVote);
    const [voteCount, setVoteCount] = useState(imageData.voteCount);
    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const imageScale = useSharedValue(1);
    const prevScale = useSharedValue(1);
    const imageTranslationX = useSharedValue(0);
    const imageTranslationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch().onStart(() => {
        prevScale.value = imageScale.value;
    }).onUpdate((event) => {
        // update the scale of the image while ensuring it stays within zoom range
        imageScale.value = clamp(prevScale.value * event.scale, 1, 4);
    }).runOnJS(true);

    const panGesture = Gesture.Pan().minDistance(1).onStart(() => {
        prevTranslationX.value = imageTranslationX.value;
        prevTranslationY.value = imageTranslationY.value;
    }).onUpdate((event) => {
        // ensure users can't pan the image out of view
        const maxTranslateX = (width / 2) * (imageScale.value - 1) / imageScale.value;
        const maxTranslateY = (height / 2) * (imageScale.value - 1) / (imageScale.value ** 2);

        imageTranslationX.value = clamp(prevTranslationX.value + event.translationX, -maxTranslateX, maxTranslateX);
        imageTranslationY.value = clamp(prevTranslationY.value + event.translationY, -maxTranslateY, maxTranslateY);
    }).runOnJS(true);
    const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: imageScale.value },
            { translateX: imageTranslationX.value },
            { translateY: imageTranslationY.value }
        ]
    }));

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
    }

    async function updateVote(initialVoteValue, updatedVoteValue) {
        const token = await AsyncStorage.getItem('token');
        const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos/${_id}/vote`;

        try {
            const response = await axios.put(url, 
                { initialVoteValue, updatedVoteValue }, 
                {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : null
                }
            });
            setUserVote(updatedVoteValue);
            setVoteCount(prevVoteCount => prevVoteCount + updatedVoteValue - initialVoteValue);
            return true;
        } catch (error) {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 401 || errorStatus == 403) {
                setViewingImage(false);
                logout(errorMessage);
            } else if (errorStatus == 400) {
                Alert.alert(
                    'Bad request',
                    `There is an issue with the request to update your vote, please try again.`
                );
            } else if (errorStatus == 404) {
                Alert.alert(
                    'Post not found', 
                    errorMessage,
                    [{ text: 'OK', onPress: () => refreshPage() }]
                );
                setViewingImage(false);
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
            console.log(`Error updating vote for image ${_id}: `, error.message);
            return false;
        }
    }

    async function editDescription() {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            logout('Unauthorized request');
            return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        if (userId == creator._id) {
            setOptionsModalOpen(false);
            setViewingImage(false);
            navigation.navigate('Edit Image Description', {
                roomId: roomId,
                imageMetadataId: _id,
                description: description
            });
        } else {
            Alert.alert('Forbidden request', 'You do not have the permission to edit this post!');
        }
    }

    function deleteImageConfirmation() {
        Alert.alert(
            'Deleting post',
            'Are you sure you want to delete this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteImage() }
            ]
        );
    }

    async function deleteImage() {
        const token = await AsyncStorage.getItem('token');
        const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos/${_id}`;

        axios.delete(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then(response => {
            Alert.alert('Image deleted', `Your image has been deleted successfully`);
            setOptionsModalOpen(false);
            setViewingImage(false);
            refreshPage();
        }).catch(error => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 401) {
                setOptionsModalOpen(false);
                setViewingImage(false);
                logout(errorMessage);
            } else if (errorStatus == 403) {
                Alert.alert('Forbidden request', errorMessage);
            } else if (errorStatus == 404) {
                Alert.alert(
                    'Image not found', 
                    errorMessage,
                    [{ text: 'OK', onPress: () => refreshPage() }]
                );
            } else if (errorStatus == 500) {
                Alert.alert(
                    'Failed to delete image', 
                    'An error occurred in the server while deleting image'
                );
            } else {
                Alert.alert(
                    'Failed to delete image',
                    'An unknown error occurred while deleting image'
                );
            }
        })
    }

    const CloseModalButton = () => {
        return (
            <View style={styles.modal.closeButton}>
                <TouchableOpacity onPress={() => setViewingImage(false)}>
                    <AntDesign name="closecircle" size={32} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    function makeReport() {
        setOptionsModalOpen(false);
        setReportModalOpen(true);
    }

    function renderModal() {
        if (!imageData) return null;

        const uploadDate = new Date(createTime).toLocaleDateString();
        const uploadTime = new Date(createTime).toLocaleTimeString();

        return (
            <Modal visible={viewingImage} animationType='fade' transparent={true}>
                <CloseModalButton />
                <View style={styles.modal.detailsContainer}>
                    <Text style={styles.modal.usernameText}>Uploaded by {creator.username}</Text>
                    <Text style={styles.modal.detailsText}>on {uploadDate} {uploadTime}</Text>
                </View>
                <TouchableOpacity style={styles.modal.optionsButton} onPress={() => setOptionsModalOpen(true)}>
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                </TouchableOpacity>
                <GestureHandlerRootView style={styles.modal.container}>
                    <GestureDetector gesture={combinedGesture}>
                        <Animated.Image
                            style={[
                                styles.modal.image,
                                imageAnimatedStyle
                            ]}
                            source={{ uri: uri }}
                        />
                    </GestureDetector>
                </GestureHandlerRootView>
                <View style={styles.modal.descriptionContainer}>
                    <ScrollView>
                        <Text style={styles.modal.descriptionText}>{description}</Text>
                    </ScrollView>
                    <VotesDisplay 
                        textColor='white' 
                        alignment='vertical' 
                        voteValue={userVote} 
                        numberOfVotes={voteCount}
                        onVoteChange={updateVote}
                    />
                    <OptionsModal 
                        modalVisible={optionsModalOpen}
                        closeModal={() => setOptionsModalOpen(false)}
                        contentType='image'
                        makeReport={makeReport}
                        editFunction={sameUser ? editDescription : null}
                        deleteFunction={sameUser ? deleteImageConfirmation : null}
                    />
                    <ReportModal 
                        modalVisible={reportModalOpen}
                        closeModal={() => setReportModalOpen(false)}
                        contentId={_id}
                        contentType='image'
                        refreshPage={() => {setViewingImage(false); refreshPage();}}
                    />
                </View>
            </Modal>
        )
    }

    function openModal() {
        imageScale.value = 1;
        imageTranslationX.value = 0;
        imageTranslationY.value = 0;
        setViewingImage(true);
        console.log(`Viewing image ${_id}`); 
    }

    return (
        <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => openModal()}>
                <Image 
                    source={{ uri: uri }}
                    style={styles.image}
                />
            </TouchableOpacity>
            {renderModal()}
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '50%',
        padding: 1
    },
    image: {
        padding: 2,
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    modal: {
        container: {
            backgroundColor: "rgba(0,0,0,0.85)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        optionsButton: {
            position: 'absolute',
            top: 16,
            right: 48,
            zIndex: 2,
        },
        detailsContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            flexDirection: 'column',
            padding: 15,
            paddingRight: 50,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.65)'
        },
        usernameText: {
            fontWeight: 'bold',
            fontSize: 16,
            color: 'white'
        },
        detailsText: {
            fontSize: 14,
            color: 'white'
        },
        image: {
            width: '100%',
            aspectRatio: 1,
            resizeMode: 'contain'
        },
        closeButton: {
            position: 'absolute', 
            top: 15, 
            right: 10, 
            zIndex: 2
        },
        descriptionContainer: {
            position: 'absolute',
            top: height - 150,
            bottom: 0,
            left: 0,
            zIndex: 1,
            padding: 15,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.65)',
            flexDirection: 'row'
        },
        descriptionText: {
            color: 'white',
            fontSize: 16
        }
    },
});