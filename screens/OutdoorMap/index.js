import { useNavigation, useRoute } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import { WebView } from "react-native-webview";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Button,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import SearchBar from "./components/SearchBar";

const apiKey = "AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4";
export default function OutdoorMap() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const mapRef = useRef();
  const [region, setRegion] = useState({
    latitude: 40.749933,
    longitude: -73.98633,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [currentLeg, setCurrentLeg] = useState(0);

  const [locations, setLocations] = useState([]);
  const [legs, setLegs] = useState([]);
  const [mode, setMode] = useState("DRIVING");

  const modes = ["DRIVING", "BICYCLING", "TRANSIT", "WALKING"];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const _locationList = params?.locationList || [];
      if (_locationList.length > 0) {
        mapRef.current?.animateToRegion({
          ...region,
          ..._locationList[0].coordinate,
        });
        setLocations(_locationList);
      }
      navigation.setParams({ locationList: [] });
    });
    return unsubscribe;
  }, [navigation, params]);

  function moveToPrev() {
    const cur = currentLeg - 1;
    if (cur < 0) {
      return;
    }
    setCurrentLeg(cur);
    mapRef.current?.animateCamera({
      center: legs[cur].coordinate,
      heading: 0,
      pitch: 0,
    });
  }
  function moveToNext() {
    const cur = currentLeg + 1;
    if (cur > legs.length - 1) {
      return;
    }
    setCurrentLeg(cur);
    mapRef.current?.animateCamera({
      center: legs[cur].coordinate,
      heading: 0,
      pitch: 0,
    });
  }

  async function handleSearch(searchInput) {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchInput
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(geocodeUrl);
      const { results } = response.data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  }

  function changeMode(mode) {
    setLegs([]);
    setCurrentLeg(0);
    setMode(mode);

    if (mode === "TRANSIT") {
      const [startLoc, destLoc] = locations;
      const { latitude: startLat, longitude: startLng } = startLoc.coordinate;
      const { latitude: destLat, longitude: destLng } = destLoc.coordinate;

      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}`
      );
    }
  }

  return (
    <>
      <View style={styles.hintConatiner}>
        {legs.length > 0 && (
          <WebView
            style={styles.hint}
            originWhitelist={["*"]}
            source={{
              html: `<!DOCTYPE html>
                      <html>
                        <head>
                          <meta
                            name="viewport"
                            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                        </head>
                        <body>
                          ${legs[currentLeg].instructions}
                        </body>
                      </html>
                     `,
            }}
          />
        )}
      </View>
      <View style={styles.modeContainer}>
        {locations.length > 0 && (
          <View style={{ flexDirection: "row" }}>
            {modes.map((e) => (
              <TouchableOpacity
                key={e}
                opacity={0.9}
                onPress={() => {
                  changeMode(e);
                }}
                style={styles.modeButton}
              >
                <Text style={{ color: "#fff" }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.mainUIContainer}>
            <MapView
              ref={(ref) => {
                mapRef.current = ref;
              }}
              style={styles.map}
              region={region}
              // onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
              {locations.map((e, i) => (
                <Marker
                  title={e.currLocation}
                  key={`marker${i}`}
                  coordinate={e.coordinate}
                />
              ))}
              {legs.map((e, i) => (
                <Marker key={`leg${i}`} coordinate={e.coordinate}>
                  <FontAwesome5 name="map-pin" size={20} color="red" />
                </Marker>
              ))}
              {locations.length > 1 && (
                <MapViewDirections
                  origin={locations[0].coordinate}
                  destination={locations[locations.length - 1].coordinate}
                  waypoints={locations.slice(1, -1).map((e) => e.coordinate)}
                  apikey={apiKey}
                  region="America"
                  mode={mode}
                  strokeWidth={8}
                  strokeColor="blue"
                  onError={(e) => {
                    Alert.alert("Warning", e);
                  }}
                  onReady={(e) => {
                    const legs = [];
                    e.legs.forEach((leg) => {
                      legs.push(
                        ...leg.steps.map((step) => ({
                          coordinate: {
                            latitude: step.start_location.lat,
                            longitude: step.start_location.lng,
                          },
                          duration: step.duration,
                          instructions: step.html_instructions,
                        }))
                      );
                    });
                    setLegs(legs);
                  }}
                />
              )}
            </MapView>
            {legs.length > 0 && (
              <View>
                <Button onPress={moveToPrev} title="Prev"></Button>
                <Button onPress={moveToNext} title="Next"></Button>
              </View>
            )}
            <SearchBar onSearch={handleSearch} />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainUIContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modeContainer: {
    alignContent: "space-between",
    position: "absolute",
    bottom: 80,
    zIndex: 99,
    width: Dimensions.get("window").width,
    opacity: 1,
  },
  modeButton: {
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: "#409EFF",
    marginHorizontal: 5,
  },
  hintConatiner: {
    position: "absolute",
    alignItems: "center",
    width: Dimensions.get("window").width,
    zIndex: 99,
    marginTop: 5,
    bottom: 130,
    opacity: 0.4,
  },
  hint: {
    height: 100,
    width: Dimensions.get("window").width,
  },
});
