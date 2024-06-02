import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { createRoot } from "react-dom/client";
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import axios from 'axios';

export default function OutdoorMap() {
  const navigation = useNavigation();
  const [mapCenter, setMapCenter] = useState({ lat: 40.749933, lng: -73.98633 });
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  async function handleSearch(searchInput) {
    const apiKey = 'AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${apiKey}`;

    try {
      const response = await axios.get(geocodeUrl);
      const { results } = response.data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setMapCenter({ lat, lng });
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  }

  async function fetchSuggestions(input) {
    const apiKey = 'AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4';
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
      const response = await axios.get(autocompleteUrl);
      const { predictions } = response.data;
      setSearchSuggestions(predictions);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);
    }
  }

  useEffect(() => {
    if (searchInput.length > 2) {
      fetchSuggestions(searchInput);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchInput]);

  const SearchBar = () => {
    return (
      <View style={styles.searchBar.container}>
        <TextInput
          onChangeText={setSearchInput}
          value={searchInput}
          style={styles.searchBar.input}
          placeholder='Search'
        />
        <Button title='Search' onPress={() => handleSearch(searchInput)} />
        {searchSuggestions.length > 0 && (
          <FlatList
            data={searchSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setSearchInput(item.description);
                handleSearch(item.description);
                setSearchSuggestions([]);
              }}>
                <Text style={styles.searchBar.suggestion}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainUIContainer}>
        <SearchBar />
        <APIProvider apiKey={'AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4'} onLoad={() => console.log('Maps API has loaded.')}>
          <Map
            defaultZoom={13}
            center={mapCenter}
            onCameraChanged={(event) => {
              const newCenter = event.detail.center;
              setMapCenter({ lat: newCenter.lat, lng: newCenter.lng });
            }}>
          </Map>
        </APIProvider>
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flexDirection: 'column',
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Outdoor Map
  mainUIContainer: {
    paddingTop: 20,
    flexDirection: 'column',
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    container: {
      padding: 6,
      borderWidth: 1,
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#ededed',
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 25,
    },
    suggestion: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  },
});
