import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import samplePhotosData from '../../assets/samplePhotosData.json';
import sampleFloorPlanData from '../../assets/sampleFloorPlanData.json';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

function clamp(value, min, max) {
    // used to make sure value is bound between min and max
    return Math.min(Math.max(value, min), max);
}

export default function ImagesPage({ route }) {
    const navigation = useNavigation();
    // dataType here is either "Entrance Photos" or "Floor Plans/Maps"
    const { roomId, roomCode, dataType } = route.params;
    const [images, setImages] = useState([]);
    const [viewingImage, setViewingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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
    }))

    useFocusEffect(
        React.useCallback(() => {
            const fetchImages = async (dataType) => {
                // insert logic to request from backend here
                if (dataType == "Entrance Photos") {
                    setImages(samplePhotosData);
                } else {
                    setImages(sampleFloorPlanData);
                }
            }
            console.log(`Fetching ${dataType} of room ${roomCode}`);
            fetchImages(dataType);
        }, [])
    );

    const CloseModalButton = () => {
        return (
            <View style={styles.modal.closeButton}>
                <TouchableOpacity onPress={() => setViewingImage(false)}>
                    <AntDesign name="closecircle" size={32} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    function renderModal() {
        if (!selectedImage) return null;

        const uploadDate = new Date(selectedImage.createTime).toLocaleDateString();
        const uploadTime = new Date(selectedImage.createTime).toLocaleTimeString();

        return (
            <Modal visible={viewingImage} animationType='fade' transparent={true}>
                <CloseModalButton />
                <View style={styles.modal.detailsContainer}>
                    <Text style={styles.modal.usernameText}>Uploaded by {selectedImage.creator.username}</Text>
                    <Text style={styles.modal.createTimeText}>on {uploadDate} {uploadTime}</Text>
                </View>
                <GestureHandlerRootView style={styles.modal.container}>
                    <GestureDetector gesture={combinedGesture}>
                        <Animated.Image
                            style={[
                                styles.modal.image,
                                imageAnimatedStyle
                            ]}
                            source={{ uri: selectedImage.image }}
                        />
                    </GestureDetector>
                </GestureHandlerRootView>
            </Modal>
        )
    }

    function openModal(image) {
        imageScale.value = 1;
        imageTranslationX.value = 0;
        imageTranslationY.value = 0;
        setSelectedImage(image);
        setViewingImage(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>{roomCode} {dataType}</Text>
            <View style={styles.uploadPhotoContainer}>
                <AddDataButton 
                    label='Upload Photo' 
                    onPress={() => navigation.navigate('Upload Image', { roomId: roomId, dataType: dataType })} 
                />
            </View>
            <ScrollView>
                <View style={styles.imageDisplayWrapper}>
                    {images.map((image) => (
                        <View style={styles.imageContainer} key={image.image}>
                            <TouchableOpacity onPress={() => openModal(image)}>
                                <Image 
                                    key={image.image}
                                    source={{ uri: image.image }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {renderModal()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 22,
        padding: 5,
        paddingLeft: 20,
    },
    uploadPhotoContainer: {
        paddingBottom: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageDisplayWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
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
        detailsContainer: {
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
            flexDirection: 'column',
            padding: 5,
        },
        usernameText: {
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white'
        },
        createTimeText: {
            fontSize: 16,
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
            right: 15, 
            zIndex: 1
        }
    }
})