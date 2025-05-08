/*
Title: Style for Signup

Description:
	Defines a common styling for the Signup pages

*/

import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colorPalette";

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
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

	// Start page
	logo: {
		width: "50%",
		height: 100,
		alignSelf: "center",
	},
	middle: {
		width: "100%",
		padding: 10,
		backgroundColor: Colors.tertiary,
	},
	middleText: {
		fontSize: 30,
		alignSelf: "center",
		fontStyle: "italic",
	},

	// Signup 1
	title: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 40,
	},
	card: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 20,
		backgroundColor: Colors.tertiary,
		padding: 20,
		borderRadius: 30,
		borderWidth: 3,
	},
	cardText: {
		fontSize: 20,
		textAlign: "center",
	},

	// Signup 2
	input: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 40,
	},
	inputLabel: {
		fontSize: 20,
	},
	inputBox: {
		width: "100%",
		textAlign: "center",
		borderBottomWidth: 4,
		alignSelf: "center",
		fontSize: 20,
	},

	// Signup 3
	scrollContent: {
		backgroundColor: Colors.background,
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
	},
	descriptionText: {
		width: "90%",
		fontSize: 20,
		alignSelf: "center",
		marginBottom: 10,
	},
	deck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		marginBottom: 20,
	},

	// Signup 4

	terms: {
		fontSize: 20,
		textDecorationLine: "underline",
		color: Colors.primary,
	},
});

export default styles;
