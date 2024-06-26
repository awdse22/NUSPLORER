import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

export default function RoomInformation({ route }) {
    const navigation = useNavigation();
    const { _id, roomCode, buildingName, floorNumber, roomAliases, floorPlan, entrancePhoto, posts } = route.params;

    const RoomDetail = ({icon, text}) => {
        return (
            <View style={styles.details.roomDetailsContainer}>
                {icon}
                <Text style={styles.details.roomDetailsFont}>{text}</Text>
            </View>
        )
    }

    const ImageDisplay = ({label, data}) => {
        return (
            <View style={styles.images.imagesContainer}>
                <View style={styles.images.titleContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.images.titleText}>{label}</Text>
                        <TouchableOpacity onPress={() => console.log(`Navigate to upload ${label}`)}>
                            <AntDesign name="pluscircle" size={20} color="#6684e8" style={{ paddingTop: 6, paddingLeft: 8 }} />
                        </TouchableOpacity>  
                    </View>
                    <TouchableOpacity onPress={() => console.log(`Navigate to ${label}`)} >
                        <Text style={styles.images.viewMoreText}>View {'>>'}</Text>
                    </TouchableOpacity>
                </View>
                {data == null ? (
                    <Text style={styles.images.noDataText}>
                            There is no data currently, but you may upload and contribute data!
                    </Text>
                ) : (
                    <ScrollView 
                        horizontal
                        snapToInterval={screenWidth} 
                        decelerationRate='fast'
                        showsHorizontalScrollIndicator={false}
                        style={styles.images.imagesDisplayContainer}
                    >
                        {data.map((imageUri, index) => (
                            <View key={index} style={styles.images.imagesDisplay}>
                                <Image source={{ uri: imageUri }} style={styles.images.image} />
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.details.detailsContainer}>
                    <Text style={styles.details.detailsText}> Room Details </Text>
                        <RoomDetail 
                            icon=<MaterialIcons name="meeting-room" size={36} color="black" />
                            text={`Room code: ${roomCode}`}
                        />
                        <RoomDetail 
                            icon=<MaterialCommunityIcons name="office-building-marker" size={36} color="black" />
                            text={`Building name: ${buildingName}`}
                        />
                        <RoomDetail 
                            icon=<MaterialCommunityIcons name="layers" size={36} color="black" />
                            text={`Floor: ${floorNumber}`}
                        />
                        <RoomDetail 
                            icon=<MaterialIcons name="label" size={36} color="black" />
                            text={`Room name${roomAliases.length > 1 ? 's' : ''}: ${roomAliases.join(', ')}`}
                        />
                </View>
                <ImageDisplay label='Photos' data={entrancePhoto} />
                <ImageDisplay label='Floor Plans/Maps' data={floorPlan} />
                <TouchableOpacity onPress={() => navigation.navigate('Information Posts Page', { posts: posts })}>
                    <View style={styles.infoPosts.viewInfoButton}>
                        <Text style={styles.infoPosts.viewInfoButtonText}>View information posts/directions</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffeded',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        padding: 8,
        justifyContent: 'center',
    },
    details: {
        detailsContainer: {
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e8e8e8',
            padding: 10,
            flexDirection: 'column',
            marginBottom: 5,
        },
        detailsText: {
            fontWeight: 'bold',
            fontSize: 24,
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
        },
        roomDetailsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            paddingRight: 20,
        },
        roomDetailsFont: {
            fontSize: 17,
            marginLeft: 2,
        }
    },
    images: {
        imagesContainer: {
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e8e8e8',
        },
        titleContainer: {
            padding: 5,
            borderBottomWidth: 1,
            borderColor: '#e6e6e6',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 22,
            paddingLeft: 10,
        },
        viewMoreText: {
            color: '#6684e8',
            fontSize: 20,
            fontWeight: 'bold',
            paddingTop: 2,
            paddingRight: 4,
            justifyContent: 'center'
        },
        imagesDisplayContainer: {
            flexDirection: 'row',
            padding: 5,
        },
        imagesDisplay: {
            margin: 3,
        },
        image: {
            resizeMode: 'cover',
            height: 130,
            width: 130,
        },
        noDataText: {
            fontSize: 16,
            padding: 10,
        }
    },
    infoPosts: {
        viewInfoButton: {
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            marginTop: 5,
            alignItems: 'center',
        },
        viewInfoButtonText: {
            fontSize: 18,
            color: '#6684e8',
            textAlign: 'center',
        }
    }
})