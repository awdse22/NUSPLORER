import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutocompleteInput from 'react-native-autocomplete-input';

import { Feather, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VenueData from '../assets/venue.json';

const apiKey = 'AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4';
async function getCoordinates(address) {
  const res = await axios.get(
    `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${apiKey}`,
  );
  const data = res.data;
  if (data.status !== 'OK' && data.results.length == 0) {
    throw new Error(`Location "${address}" not found`);
  }
  const location = data.results[0].geometry.location;
  return {
    latitude: location.lat,
    longitude: location.lng,
  };
}

export default function NavigationScreen() {
  const [locationList, setLocationList] = useState([{}, {}]);
  const navigator = useNavigation();

  const Location = ({ index, location }) => {
    const [locationInput, setLocationInput] = useState(location?.currLocation);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const isStartingLocation = index == 0;
    const isEndingLocation = index == locationList.length - 1;

    async function searchLocation() {
      if (locationInput.length === 0) {
        return;
      }
      try {
        const res = VenueData[locationInput.toUpperCase()];
        if (res) {
          const { x, y } = res.location;
          locationList[index] = {
            currLocation: locationInput,
            locationChosen: true,
            coordinate: {
              latitude: y,
              longitude: x,
            },
          };
        } else {
          locationList[index] = {
            currLocation: locationInput,
            locationChosen: true,
            coordinate: await getCoordinates(locationInput),
          };
        }
        setLocationList([...locationList]);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }

    function renderModal() {
      return (
        <Modal visible={modalOpen} animationType="fade" transparent={true}>
          <View style={styles.modal.container}>
            <View style={styles.modal.window}>
              <TouchableOpacity
                onPress={addDestinationBelow}
                style={[styles.modal.button, { borderBottomWidth: 1, borderColor: 'grey' }]}
              >
                <Text style={styles.modal.buttonText}>Add destination below</Text>
              </TouchableOpacity>
              {!isStartingLocation && (
                <TouchableOpacity
                  onPress={removeDestination}
                  style={[styles.modal.button, { borderBottomWidth: 1, borderColor: 'grey' }]}
                >
                  <Text style={styles.modal.buttonText}>Remove destination</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.modal.button}>
                <Text style={styles.modal.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    function addDestinationBelow() {
      if (locationList.length >= 5) {
        Alert.alert('Invalid input', 'Maximum of 5 destinations allowed');
        return;
      }
      locationList.splice(index + 1, 0, {});
      setLocationList([...locationList]);
      setModalOpen(false);
    }

    function removeDestination() {
      locationList.splice(index, 1);
      setLocationList([...locationList]);
      setModalOpen(false);
    }

    async function searchQuery(text) {
      setLocationInput(text);
      location.currLocation = text;
      if (text) {
        const results = Object.keys(VenueData).filter((key) =>
          key.toLowerCase().includes(text.toLowerCase()),
        );
        setLocationSuggestions(results.slice(0, 5));
      } else {
        setLocationSuggestions([]);
      }
    }

    function selectQuery(venue) {
      setLocationInput(venue);
      location.currLocation = venue;
      setLocationSuggestions([]);
    }

    const SuggestionList = (props) => {
      return (
        <View>
          <FlatList
            {...props}
            style={{ borderWidth: 1, backgroundColor: 'white' }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectQuery(item)} style={{ borderWidth: 0.5 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 5 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    };

    return (
      <View style={[styles.locationInfo.container, { top: 30 + index * 60, zIndex: -index }]}>
        <Feather
          style={{ marginRight: 10 }}
          name={isStartingLocation ? 'chevron-right' : isEndingLocation ? 'check' : 'chevrons-down'}
          size={23}
          color="#232323"
        />
        <View
          style={[
            styles.locationInfo.userInterface,
            location.locationChosen && { backgroundColor: '#dbdbdb' },
          ]}
        >
          {location.locationChosen ? (
            <View style={styles.locationInfo.searchBar}>
              <Text style={styles.locationInfo.inputBoxText} numberOfLines={1} ellipsizeMode="tail">
                {locationInput}
              </Text>
            </View>
          ) : (
            <AutocompleteInput
              style={{ height: '100%', backgroundColor: 'rgb(0,0,0,0)' }}
              containerStyle={[styles.locationInfo.searchBar]}
              inputContainerStyle={styles.locationInfo.inputBox}
              listContainerStyle={styles.locationInfo.listStyle}
              data={locationSuggestions}
              defaultValue={locationInput}
              onChangeText={searchQuery}
              flatListProps={{ keyExtractor: (item, index) => `key-${index}` }}
              renderResultList={SuggestionList}
              placeholder={isStartingLocation ? 'Choose starting location' : 'Choose destination'}
            />
          )}
          <View>
            <View style={styles.locationInfo.iconContainer}>
              {location.locationChosen ? (
                <TouchableOpacity
                  style={{ marginRight: 5 }}
                  onPress={() => {
                    location.locationChosen = false;
                    setLocationList([...locationList]);
                  }}
                >
                  <MaterialIcons name="edit" size={20} color="#232323" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={searchLocation} style={{ marginRight: 5 }}>
                  <Ionicons name="search" size={20} color="#232323" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalOpen(true)}
                style={{ paddingHorizontal: 10 }}
              >
                <FontAwesome name="ellipsis-v" size={20} color="#232323" />
              </TouchableOpacity>
            </View>
            {renderModal()}
          </View>
        </View>
      </View>
    );
  };

  function navigate() {
    if (locationList.length < 2) {
      Alert.alert('Invalid input', 'You need a starting point and a destination');
    } else if (locationList[0]?.locationChosen != true) {
      Alert.alert('Invalid input', 'You need to choose a starting point');
    } else if (locationList.slice(1).some((i) => i?.locationChosen != true)) {
      Alert.alert('Invalid input', 'All destinations need to be valid');
    } else {
      navigator.jumpTo('Map', { locationList: [...locationList] });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        {locationList.map((location, i) => (
          <Location key={`position${i}`} index={i} location={location} />
        ))}
        <TouchableOpacity style={styles.navigateButton} onPress={navigate}>
          <Ionicons style={{ marginRight: 10 }} name="navigate" size={19} color="white" />
          <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Navigate</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 70,
  },
  locationList: {
    width: '100%',
    height: '100%',
  },
  locationInfo: {
    container: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      left: 15,
    },
    userInterface: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
      borderRadius: 10,
      backgroundColor: '#f6f7fb',
      borderWidth: 1,
    },
    searchBar: {
      flex: 1,
      height: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    inputBox: {
      flex: 1,
      height: 32,
      paddingHorizontal: 10,
      borderWidth: 0,
    },
    inputBoxText: {
      fontSize: 16,
      paddingHorizontal: 10,
    },
    listStyle: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 9,
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
    },
  },
  navigateButton: {
    position: 'absolute',
    left: '50%',
    bottom: 20,
    transform: [{ translateX: -40 }],
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#4872d1',
    zIndex: 1000,
  },
});
