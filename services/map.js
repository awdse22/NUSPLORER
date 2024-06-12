import axios from "axios";

export async function fetchSuggestions(input) {
	const apiKey = "AIzaSyBYYtYwdIsgeOtEKmVA1wdKe1DI98Q8-z4";
	const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
		input,
	)}&key=${apiKey}`;

	try {
		const response = await axios.get(autocompleteUrl);
		const { predictions } = response.data;
		return predictions;
	} catch (error) {
		console.error("Error fetching autocomplete data:", error);
	}
}
