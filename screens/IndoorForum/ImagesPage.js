import React, { useState } from 'react';
import { 
    StyleSheet, 
    SafeAreaView, 
    View, 
    Text, 
    ScrollView, 
    Alert
} from 'react-native';
import AddDataButton from '../../Components/IndoorForumComponents/AddDataButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageDisplay from '../../Components/IndoorForumComponents/ImageDisplay';

export default function ImagesPage({ route }) {
    const navigation = useNavigation();
    // dataType here is either "Entrance Photos" or "Floor Plans/Maps"
    const { roomId, roomCode, dataType } = route.params;
    const [images, setImages] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchImages = async () => {
                const token = await AsyncStorage.getItem('token');
                // const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos?dataType=${dataType}`;
                const url = `http://10.0.2.2:3000/rooms/${roomId}/photos?dataType=${dataType}`;

                axios.get(url, { 
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : null
                    }
                }).then((response) => {
                    setImages(response.data);
                }).catch((error) => {
                    const errorStatus = error.response.status;
                    console.error('Error fetching data: ', error.message);
                })
            }
            console.log(`Fetching ${dataType} of room ${roomCode}`);
            fetchImages();
        }, [])
    );

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
                    {images.length == 0 && (
                        <Text style={styles.noInformation}>
                            There are no images of {dataType}
                        </Text>
                    )}
                    {images.map((image) => {
                        const imageData = {
                            uri: `data:image/${image.imageId.imageType};base64,${image.imageId.data}`,
                            roomId: roomId,
                            ...image
                        };
                        return <ImageDisplay imageData={imageData} key={image.imageId._id} />;
                    })}
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
    }
})