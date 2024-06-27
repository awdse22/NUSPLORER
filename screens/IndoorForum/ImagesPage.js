import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import samplePhotosData from '../../assets/samplePhotosData.json';
import sampleFloorPlanData from '../../assets/sampleFloorPlanData.json';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ImagesPage({ route }) {
    const navigation = useNavigation();
    // dataType here is either "Entrance Photos" or "Floor Plans/Maps"
    const { roomId, roomCode, dataType } = route.params;
    const [images, setImages] = useState([]);

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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>{roomCode} {dataType}</Text>
            <View style={styles.uploadPhotoContainer}>
                <AddDataButton label='Upload Photo' onPress={() => navigation.navigate('Upload Image', { roomId: roomId })} />
            </View>
            <ScrollView>
                <View style={styles.imageDisplayWrapper}>
                    {images.map((image) => (
                        <View style={styles.imageContainer} key={image.image}>
                            <TouchableOpacity onPress={() => console.log(`Viewing ${image.image}`)}>
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
    }
})