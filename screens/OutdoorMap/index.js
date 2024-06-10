import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import SearchBar from "./components/SearchBar";

export default function OutdoorMap() {
	const navigation = useNavigation();
	const [region, setRegion] = useState({
		latitude: 40.749933,
		longitude: -73.98633,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	async function handleSearch(searchInput) {
		console.debug("%c Line:31 🥒 searchInput", "color:#3f7cff", searchInput);
		const apiKey = "AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4";
		const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			searchInput,
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

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.mainUIContainer}>
					<MapView
						style={styles.map}
						region={region}
						onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
					>
						<Marker
							coordinate={{
								latitude: region.latitude,
								longitude: region.longitude,
							}}
						/>
					</MapView>
					<SearchBar onSearch={handleSearch} />
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mainUIContainer: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
});
