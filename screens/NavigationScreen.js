import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Feather, Ionicons, AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function NavigationScreen() {
    const [idCount, setIdCount] = useState(0); // id to be used as keys for mapping locationList to components
    const [locationList, setLocationList] = useState([]);

    function addLocation(underLocationOrder) { // underLocationOrder is the order of the location to add destination under
        setIdCount(prevIdCount => {
            // increment the orders of all location with higher order by 1
            setLocationList(prevLocationList => prevLocationList.map(location => {
                if (location.order > underLocationOrder) {
                    return {
                        id: location.id,
                        order: location.order + 1,
                        currLocation: location.currLocation
                    };
                } else {
                    return location;
                }
            }))
            
            const newLocation = {
                id: prevIdCount,
                order: underLocationOrder + 1,
                currLocation: ''
            };
            
            {/* Add new location and sort based on order */}
            setLocationList(prevLocationList => 
                [...prevLocationList, newLocation].sort((locationA, locationB) => locationA.order - locationB.order));
            return prevIdCount + 1;
        });
    }

    function deleteLocation(locationOrder) {
        setLocationList(prevLocationList => prevLocationList.filter(l => l.order != locationOrder));
        
        // decrement the orders of all location with higher order by 1
        setLocationList(prevLocationList => prevLocationList.map(location => {
            if (location.order > locationOrder) {
                return {
                    id: location.id,
                    order: location.order - 1,
                    currLocation: location.currLocation
                };
            } else {
                return location;
            }
        }))
    }

    function generateLocationListLayout() {
        if (locationList.length == 0) {
            setIdCount(0);
            addLocation(-1);
            addLocation(0);
        }
    }

    const Location = ({order, currLocation}) => { // order does not matter for now, will be used to implement drag to sort function
        const [locationChosen, setLocationChosen] = useState(currLocation != '');
        const [locationInput, setLocationInput] = useState(currLocation);
        const [modalOpen, setModalOpen] = useState(false);
        const isStartingLocation = order == 0;
        
        function searchLocation() {
            if (locationInput.length > 0) {
                setLocationChosen(true);
                setLocationList(prevLocationList => prevLocationList.map(location => {
                    if (location.order == order) {
                        return {
                            id: location.id,
                            order: location.order,
                            currLocation: locationInput
                        };
                    } else {
                        return location;
                    }
                }))
            }
        }
    
        function renderModal() {
            return (
                <Modal visible={modalOpen} animationType='fade' transparent={true}>
                    <View style={styles.modal.container}>
                        <View style={styles.modal.window}>
                            <TouchableOpacity 
                                onPress={addDestinationBelow} 
                                style={[styles.modal.button, { borderBottomWidth: 1, borderColor: 'grey' }]}>
                                <Text style={styles.modal.buttonText}>Add destination below</Text>
                            </TouchableOpacity>
                            {!isStartingLocation && (
                                <TouchableOpacity 
                                    onPress={removeDestination} 
                                    style={[styles.modal.button, { borderBottomWidth: 1, borderColor: 'grey' }]}>
                                    <Text style={styles.modal.buttonText}>Remove destination</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                onPress={() => setModalOpen(false)} 
                                style={styles.modal.button}>
                                <Text style={styles.modal.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )
        }

        function addDestinationBelow() {
            addLocation(order);
            setModalOpen(false);
        }

        function removeDestination() {
            deleteLocation(order);
            setModalOpen(false);
        }
    
        return (
            <View style={styles.locationInfo.container}>

                {/* Arrows pointing to destination locations */}
                {(!isStartingLocation) && (
                <View style={styles.locationInfo.path}>
                    <AntDesign name="arrowdown" size={36} color="black" />
                    <AntDesign name="arrowdown" size={36} color="black" />
                </View>
                )}

                <View style={styles.locationInfo.userInterface}>
                    {isStartingLocation ? (<Feather name="navigation" size={36} color="black" />) 
                        : (<Ionicons name="location-sharp" size={36} color="black" />)}
                    {locationChosen ? (
                        <View style={styles.locationInfo.locationChosen}>
                            <Text style={styles.locationInfo.inputBox} numberOfLines={1} ellipsizeMode='tail'>{locationInput}</Text>
                            <TouchableOpacity onPress={() => setLocationChosen(false)}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.locationInfo.locationNotChosen}>
                            <TextInput 
                            style={styles.locationInfo.inputBox}
                            onChangeText={setLocationInput}
                            value={locationInput}
                            placeholder={isStartingLocation ? 'Choose starting location' : 'Choose destination'} />
                            <TouchableOpacity onPress={searchLocation}>
                                <Ionicons name="search" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{ paddingRight: 10 }}>
                        <TouchableOpacity onPress={() => setModalOpen(true)}>
                            <FontAwesome name="ellipsis-v" size={24} color="black" />
                        </TouchableOpacity>
                        {renderModal()}
                    </View>
                </View>
            </View>
        );
    }


    useEffect(() => {
        generateLocationListLayout();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <Text>Navigation Screen</Text>
                <ScrollView style={styles.locationList}>
                    {locationList.map((location) => <Location 
                            key={location.id}
                            order={location.order} 
                            currLocation={location.currLocation} />
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingBottom: 70,
        backgroundColor: 'white',
    },
    locationList: {
        width: '100%',
        height: '100%',
    },
    locationInfo: {
        container: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        path: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
        },
        userInterface: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: '#f2f2f2',
        },
        locationNotChosen: {
            width: '75%',
            height: 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'grey',
            backgroundColor: 'white',
        },
        locationChosen: {
            width: '75%',
            height: 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        inputBox: {
            flex: 1,
            fontSize: 18,
            padding: 0,  
        },
    },
    modal: {
        container: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        window: {
            backgroundColor: 'white',
            borderRadius: 10,
            width: '80%',
        },
        button: {
            width: '100%',
            height: 50,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 18,
        }
    }
})