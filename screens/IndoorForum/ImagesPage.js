import React, { useState } from 'react';
import { 
    StyleSheet, 
    SafeAreaView, 
    View, 
    Text, 
    ScrollView, 
    Alert,
    ActivityIndicator
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
    const [loadingImages, setLoadingImages] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchImages = async () => {
        const token = await AsyncStorage.getItem('token');
        // const url = `https://nusplorer.onrender.com/rooms/${roomId}/photos?dataType=${dataType}`;
        const url = `http://10.0.2.2:3000/rooms/${roomId}/photos?dataType=${dataType}`;
        setLoadingImages(true);
        setErrorMessageVisible(false);
        setErrorMessage('');
        console.log(`Fetching ${dataType} of room ${roomCode}`);

        axios.get(url, { 
            headers: {
                'Authorization': token ? `Bearer ${token}` : null
            }
        }).then((response) => {
            setImages(response.data);
            setLoadingImages(false);
        }).catch((error) => {
            const errorStatus = error.response.status;
            const errorMessage = error.response.data.error;
            if (errorStatus == 400) {
                setErrorMessage('There is an issue with the request to fetch data, please try again');
                setErrorMessageVisible(true);
            } else if (errorStatus == 401 || errorStatus == 403) {
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
                setErrorMessage('An error occurred in the server while fetching images');
                setErrorMessageVisible(true);
            } else {
                setErrorMessage('An unknown error occurred while fetching images');
                setErrorMessageVisible(true);
            }
            console.log('Error fetching data: ', error.message);
            setImages([]);
            setLoadingImages(false);
        })
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchImages();
        }, [])
    );

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
                {loadingImages ? (
                    <ActivityIndicator 
                        animating={true}
                        size='large'
                        color='#003db8'
                    />
                ) : (
                    <View style={styles.imageDisplayWrapper}>
                        {images.length == 0 && (
                            errorMessageVisible ? (
                                <Text style={[styles.noDataFound, { color: 'red' }]}>{errorMessage}</Text>
                            ) : (
                                <Text style={styles.noDataFound}>
                                    There are no uploaded images currently
                                </Text>
                            )
                        )}
                        {images.map((image) => {
                            const imageData = {
                                uri: `data:image/${image.imageId.imageType};base64,${image.imageId.data}`,
                                roomId: roomId,
                                ...image
                            };
                            return <ImageDisplay imageData={imageData} key={image.imageId._id} refreshPage={fetchImages} />;
                        })}
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
    noDataFound: {
        textAlign: 'center', 
        fontSize: 16, 
        fontWeight: 'bold',
        margin: 10,
    },
})