import React, { useState, useEffect } from 'react'
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
} from 'react-native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  Feather,
  Ionicons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
async function getPosition(address) {
  const apiKey = 'AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4'
  const res = await axios.get(
    `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
      address
    )}&key=${apiKey}`
  )
  const data = res.data
  if (data.status !== 'OK' && data.results.length == 0) {
    throw new Error(`${address} not found`)
  }
  const location = data.results[0].geometry.location
  return {
    latitude: location.lat,
    longitude: location.lng,
  }
}
export default function NavigationScreen() {
  const [locationList, setLocationList] = useState([{}, {}])
  const navigator = useNavigation()

  const Location = ({ index, location }) => {
    // index does not matter for now, will be used to implement drag to sort function
    const [locationInput, setLocationInput] = useState(location?.currLocation)
    const [modalOpen, setModalOpen] = useState(false)
    const isStartingLocation = index == 0

    async function searchLocation() {
      if (locationInput.length === 0) {
        return
      }
      try {
        locationList[index] = {
          currLocation: locationInput,
          locationChosen: true,
          coordinate: await getPosition(locationInput),
        }
      } catch (e) {
        Alert.alert('Error', e.message)
        return
      }
      setLocationList([...locationList])
    }

    function renderModal() {
      return (
        <Modal visible={modalOpen} animationType="fade" transparent={true}>
          <View style={styles.modal.container}>
            <View style={styles.modal.window}>
              <TouchableOpacity
                onPress={addDestinationBelow}
                style={[
                  styles.modal.button,
                  { borderBottomWidth: 1, borderColor: 'grey' },
                ]}>
                <Text style={styles.modal.buttonText}>
                  Add destination below
                </Text>
              </TouchableOpacity>
              {!isStartingLocation && (
                <TouchableOpacity
                  onPress={removeDestination}
                  style={[
                    styles.modal.button,
                    { borderBottomWidth: 1, borderColor: 'grey' },
                  ]}>
                  <Text style={styles.modal.buttonText}>
                    Remove destination
                  </Text>
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
      locationList.splice(index + 1, 0, {})
      setLocationList([...locationList])
      setModalOpen(false)
    }

    function removeDestination() {
      locationList.splice(index, 1)
      setLocationList([...locationList])
      setModalOpen(false)
    }

    return (
      <View style={styles.locationInfo.container}>
        {/* Arrows pointing to destination locations */}
        {!isStartingLocation && (
          <View style={styles.locationInfo.path}>
            <AntDesign name="arrowdown" size={36} color="black" />
            <AntDesign name="arrowdown" size={36} color="black" />
          </View>
        )}

        <View style={styles.locationInfo.userInterface}>
          {isStartingLocation ? (
            <Feather name="navigation" size={36} color="black" />
          ) : (
            <Ionicons name="location-sharp" size={36} color="black" />
          )}
          {location.locationChosen ? (
            <View style={styles.locationInfo.locationChosen}>
              <Text
                style={styles.locationInfo.inputBox}
                numberOfLines={1}
                ellipsizeMode="tail">
                {locationInput}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  location.locationChosen = false
                  setLocationList([...locationList])
                }}>
                <MaterialIcons name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationInfo.locationNotChosen}>
              <TextInput
                style={styles.locationInfo.inputBox}
                onChangeText={(text) => {
                  setLocationInput(text)
                  location.currLocation = text
                }}
                value={locationInput}
                placeholder={
                  isStartingLocation
                    ? 'Choose starting location'
                    : 'Choose destination'
                }
              />
              <TouchableOpacity onPress={searchLocation}>
                <Ionicons name="search" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
          <View>
            <TouchableOpacity
              onPress={() => setModalOpen(true)}
              style={{ paddingHorizontal: 10 }}>
              <FontAwesome name="ellipsis-v" size={24} color="black" />
            </TouchableOpacity>
            {renderModal()}
          </View>
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.locationList}>
          {locationList.map((location, i) => (
            <Location key={`position${i}`} index={i} location={location} />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
          }}
          onPress={() => {
            if (locationList.length < 2) {
              Alert.alert('Warning', 'Please set two place at least.')
              return
            }
            navigator.jumpTo('Map', { locationList: [...locationList] })
          }}>
          <Ionicons name="navigate" size={30} color="black" />
          <Text>Navigate</Text>
        </TouchableOpacity>
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
    },
  },
})
