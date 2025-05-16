/*
Title: Style for Profile

Description:
    Defines a common styling for the Profile pages

*/

import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../../constants/colorPalette";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		justifyContent: "space-between",
		alignItems: "center",
	},
	top: {
		flex: 1,
		width: "100%",
		marginTop: 20,
		gap: 20,
	},
	bottom: {
		width: "100%",
		marginBottom: 40,
		gap: 20,
	},
	bottomButton: {
		alignSelf: "center",
		width: "90%",
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	bottomButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},

	// Specific to Profile
	title: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		textAlign: "center",
	},
	descriptionText: {
		width: "90%",
		fontSize: 20,
		alignSelf: "center",
		textAlign: "center",
	},
	skillCard: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
		borderWidth: 3,
	},
	skillCardText: {
		fontSize: 20,
	},
	skillDeck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		marginBottom: 20,
	},
	image: {
		width: width * 0.8, // 4:3 aspect ratio
		height: width * 0.6,
		//borderWidth: 5, // remove this
		alignSelf: "center",
		zIndex: 0,
	},

	cv: {
		width: "90%",
		alignSelf: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cvButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	cvButtonText: {
		fontSize: 16,
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	editButton: {
		alignSelf: "center",
		width: "90%",
		gap: 20,
	},
	editButtonText: {
		fontSize: 20,
	},
	pickImage: {
		position: "absolute", // Ensure it overlays the Image
		zIndex: 1,
		gap: 20,
		flexDirection: "row",
		alignSelf: "center",
	},
	pickImageOptions: {
		padding: 10,
		borderRadius: 0,
		backgroundColor: "black",
	},
	pickImageText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},

	// history page
	info: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
		gap: 20,
	},
	infoText: {
		fontSize: 20,
	},
	list: {
		flexGrow: 1,
		width: "90%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	// item
	item: {
		backgroundColor: Colors.tertiary,
		padding: 16,
		borderWidth: 2,
		borderRadius: 20,
		marginBottom: 10,
		flexDirection: "row",
		zIndex: 0,
	},
	itemBody: {
		flex: 1,
	},
	itemHeader: {
		flex: 1,
		gap: 10,
		marginBottom: 5,
	},
	itemText: {
		fontSize: 24,
		verticalAlign: "middle",
	},
	itemSide: {
		padding: 10,
		//backgroundColor: Colors.primary,
		borderRadius: 20,
		alignSelf: "flex-start",
		zIndex: 1,
	},
});

export default styles;
