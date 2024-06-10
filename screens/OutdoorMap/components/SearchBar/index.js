import React from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	TouchableOpacity,
	FlatList,
} from "react-native";

import { fetchSuggestions } from "../../../../services/map";

const SearchBar = (props) => {
	const { onSearch } = props;
	const [value, setValue] = React.useState("");
	const [searchSuggestions, setSearchSuggestions] = React.useState([]);

	return (
		<View style={styles.searchBar.container}>
			<View style={styles.container}>
				<TextInput
					onChangeText={(text) => {
						setValue(text);
						fetchSuggestions(value).then((data) => {
							setSearchSuggestions(data);
						});
					}}
					value={value}
					style={styles.searchBar.input}
					placeholder="Search for a location"
				/>
				<Button title="Search" onPress={() => onSearch(value)} />
			</View>
			{searchSuggestions?.length > 0 && (
				<FlatList
					data={searchSuggestions}
					keyExtractor={(item) => item.place_id}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => {
								setValue(item.description);
								onSearch(item.description);
								setSearchSuggestions([]);
							}}
						>
							<Text style={styles.searchBar.suggestion}>
								{item.description}
							</Text>
						</TouchableOpacity>
					)}
				/>
			)}
		</View>
	);
};

export default React.memo(SearchBar);

const styles = StyleSheet.create({
	searchBar: {
		container: {
			width: "90%",
			position: "absolute",
			top: 10,
			left: 20,
			paddingVertical: 6,
			paddingHorizontal: 10,
			flexDirection: "column",
			borderRadius: 20,
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
			justifyContent: "space-between",
			backgroundColor: "#ededed",
		},
		input: {
			padding: 6,
			fontSize: 18,
		},
		suggestion: {
			padding: 10,
			borderBottomWidth: 1,
			borderBottomColor: "#ccc",
		},
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
