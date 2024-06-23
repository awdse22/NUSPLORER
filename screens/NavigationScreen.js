import React, { useState, useEffect } from "react";
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
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Feather,
  Ionicons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import VenueData from "../assets/venue.json";

async function getPosition(address) {
  const apiKey = "AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4";
  const res = await axios.get(
    `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
      address
    )}&key=${apiKey}`
  );
  const data = res.data;
  if (data.status !== "OK" && data.results.length == 0) {
    throw new Error(`${address} not found`);
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
    // index does not matter for now, will be used to implement drag to sort function
    const [locationInput, setLocationInput] = useState(location?.currLocation);
    const [modalOpen, setModalOpen] = useState(false);
    const isStartingLocation = index == 0;
    const isEndingLocation = index == locationList.length - 1;

    async function searchLocation() {
      if (locationInput.length === 0) {
        return;
      }
      try {
        locationList[index] = {
          currLocation: locationInput,
          locationChosen: true,
          coordinate: await getPosition(locationInput),
        };
      } catch (e) {
        const res = VenueData[locationInput.toUpperCase()];
        if (!res) {
          Alert.alert("Error", e.message);
        } else {
          const { x, y } = res.location;
          locationList[index] = {
            currLocation: locationInput,
            locationChosen: true,
            coordinate: {
              latitude: y,
              longitude: x,
            },
          };
        }
        return;
      }
      setLocationList([...locationList]);
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
                  { borderBottomWidth: 1, borderColor: "grey" },
                ]}
              >
                <Text style={styles.modal.buttonText}>
                  Add destination below
                </Text>
              </TouchableOpacity>
              {!isStartingLocation && (
                <TouchableOpacity
                  onPress={removeDestination}
                  style={[
                    styles.modal.button,
                    { borderBottomWidth: 1, borderColor: "grey" },
                  ]}
                >
                  <Text style={styles.modal.buttonText}>
                    Remove destination
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={styles.modal.button}
              >
                <Text style={styles.modal.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    function addDestinationBelow() {
      locationList.splice(index + 1, 0, {});
      setLocationList([...locationList]);
      setModalOpen(false);
    }

    function removeDestination() {
      locationList.splice(index, 1);
      setLocationList([...locationList]);
      setModalOpen(false);
    }

    return (
      <View style={styles.locationInfo.container}>
        <Feather
          style={{ marginRight: 10 }}
          name={
            isStartingLocation
              ? "chevron-right"
              : isEndingLocation
              ? "check"
              : "chevrons-down"
          }
          size={23}
          color="#232323"
        />
        <View
          style={[
            styles.locationInfo.userInterface,
            !location.locationChosen && { backgroundColor: "#f2f2f3" },
          ]}
        >
          {location.locationChosen ? (
            <View style={styles.locationInfo.locationChosen}>
              <Text
                style={styles.locationInfo.inputBox}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationInput}
              </Text>
              <TouchableOpacity
                style={{ marginRight: 5 }}
                onPress={() => {
                  location.locationChosen = false;
                  setLocationList([...locationList]);
                }}
              >
                <MaterialIcons name="edit" size={18} color="#232323" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationInfo.locationNotChosen}>
              <TextInput
                style={styles.locationInfo.inputBox}
                onChangeText={(text) => {
                  setLocationInput(text);
                  location.currLocation = text;
                }}
                value={locationInput}
                placeholder={
                  isStartingLocation
                    ? "Choose starting location"
                    : "Choose destination"
                }
              />
              <TouchableOpacity
                onPress={searchLocation}
                style={{ marginRight: 5 }}
              >
                <Ionicons name="search" size={18} color="#232323" />
              </TouchableOpacity>
            </View>
          )}
          <View>
            <TouchableOpacity
              onPress={() => setModalOpen(true)}
              style={{ paddingHorizontal: 10 }}
            >
              <FontAwesome name="ellipsis-v" size={18} color="#232323" />
            </TouchableOpacity>
            {renderModal()}
          </View>
        </View>
      </View>
    );
  };

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
            marginTop: 10,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#94abdb",
          }}
          onPress={() => {
            if (locationList.length < 2) {
              Alert.alert("Warning", "Please set two place at least.");
              return;
            }
            navigator.jumpTo("Map", { locationList: [...locationList] });
          }}
        >
          <Ionicons
            style={{ marginRight: 10 }}
            name="navigate"
            size={19}
            color="#4872d1"
          />
          <Text style={{ fontSize: 14, color: "#4872d1" }}>Start Navigate</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 70,
    backgroundColor: "#fff",
  },
  locationList: {
    width: "100%",
    height: "100%",
  },
  locationInfo: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      justifyContent: "center",
    },
    path: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
    },
    userInterface: {
      flex: 1,
      flexDirection: "row",
      marginBottom: 8,
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      borderRadius: 10,
      backgroundColor: "#f6f7fb",
    },
    locationNotChosen: {
      flex: 1,
      height: 32,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f2f2f3",
    },
    locationChosen: {
      flex: 1,
      height: 32,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    inputBox: {
      flex: 1,
      fontSize: 15,
      paddingHorizontal: 10,
    },
  },
  modal: {
    container: {
      backgroundColor: "rgba(0,0,0,0.5)",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    window: {
      backgroundColor: "white",
      borderRadius: 10,
      width: "80%",
    },
    button: {
      width: "100%",
      height: 50,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 18,
    },
  },
});
