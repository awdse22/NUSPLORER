import { React, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Controller } from 'react-hook-form';
import ImageNotUploaded from '../../assets/ImageNotUploaded.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function IndoorDataInput({ fieldName, label, info, 
    control, rules, type }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageWidth, setImageWidth] = useState(250);
    const [imageHeight, setImageHeight] = useState(400);

    async function uploadImage(onChange) {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                alert("Permission to access media library required!");
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1
            })

            if (!result.canceled) {
                const uploadedImage = result.assets[0].uri;
                setSelectedImage(uploadedImage);
                fixImageDisplaySize(uploadedImage);
                const imageType = result.assets[0].type;

                const base64Image = await FileSystem.readAsStringAsync(uploadedImage, {
                    encoding: FileSystem.EncodingType.Base64
                });

                const imageData = `data:${imageType};base64,${base64Image}`
                onChange(imageData);
            }
        } catch (error) {
            alert("Error uploading image: " + error.message);
        }
    }

    function fixImageDisplaySize(imageUri) {
        Image.getSize(imageUri, (width, height) => {
            const maxWidth = 250;
            const maxHeight = 400;
            const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
            setImageWidth(scaleFactor * width);
            setImageHeight(scaleFactor * height);
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>{label}: </Text>
            {info != null && <Text style={styles.infoText}>{info}</Text>}
            <Controller
                control={control}
                name={fieldName}
                rules={rules}
                defaultValue=""
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <View>
                        {type == 'image' && (
                            <TouchableOpacity onPress={() => uploadImage(onChange)}>
                            {selectedImage == null ? (
                                <View style={styles.imageInput.imageNotUploadedContainer} >
                                    <Image source={ImageNotUploaded} style={styles.imageInput.imageNotUploaded} />
                                </View>
                            ) : (
                                <Image 
                                    source={{ uri: selectedImage }} 
                                    style={[styles.imageInput.uploadedImage, {width: imageWidth, height: imageHeight}]}
                                />
                            )}
                            </TouchableOpacity>
                        )}
                        <TextInput 
                            value={value} 
                            onChangeText={onChange} 
                            onBlur={onBlur}
                            multiline={type == 'post'}
                            style={[
                                styles.inputBox, 
                                { fontSize: type == 'data' ? 20 : 15},
                                type == 'image' ? { display: 'none' } : {},
                                error ? {borderColor: 'red'} : {borderColor: '#e8e8e8'}
                            ]}
                        />
                        {type == 'post' && <Text style={styles.characterCount}>
                            {value.length} / {rules.maxLength.value} characters
                        </Text>}
                        <View style={styles.errorMessageContainer}>
                            {error && <Text style={styles.errorMessage}>{error.message}</Text>}
                        </View>
                    </View>
                )}      
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        width: '100%',
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 10
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    infoText: {
        fontSize: 14,
        color: '#858585',
    },
    inputBox: {
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
        borderWidth: 2,
        borderRadius: 8,
        width: '95%',
        padding: 5,
        marginTop: 5,
    },
    dataInputText: {
        fontSize: 20
    },
    errorMessageContainer: {
        height: 25
    },
    errorMessage: {
        marginLeft: 3,
        color: 'red',
        fontSize: 16
    },
    characterCount: {
        marginLeft: 3,
        fontSize: 12,
        color: 'grey'
    },
    imageInput: {
        imageNotUploadedContainer: {
            width: 150,
            height: 150,
            borderWidth: 10,
            borderStyle: 'dotted',
            borderColor: 'grey',
            borderRadius: 15,
            alignSelf: 'center',
            margin: 10,
        },
        imageNotUploaded: {
            width: '100%',
            height: '100%',
            tintColor: 'grey'
        },
        uploadedImage: {
            resizeMode: 'contain',
            alignSelf: 'center',
        }
    }
})