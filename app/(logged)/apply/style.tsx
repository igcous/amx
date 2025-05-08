/*
Title: Style for Signup

Description:
	Defines a common styling for the Apply pages

*/

import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../../constants/colorPalette";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		justifyContent: "space-between",
		alignItems: "center",
	},
	top: {
		width: "100%",
		marginTop: 20,
		gap: 20,
	},
	bottom: {
		width: "100%",
		marginBottom: 40,
		gap: 20,
	},

	// Swiping page
	info: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
	},
	infoText: {
		fontSize: 20,
	},
	tinderCardContainer: {
		flex: 1,
		borderWidth: 0,
		justifyContent: "flex-start",
	},
	tinderCard: {
		flex: 1,
		position: "absolute",
		backgroundColor: Colors.tertiary,
		width: "95%",
		height: 0.7 * height,
		alignSelf: "center",
		justifyContent: "space-around",
		borderWidth: 2,
		borderRadius: 20,
	},
	tinderCardContent: {
		width: "90%",
		alignSelf: "center",
	},
	tinderCardText: {
		fontSize: 30,
		color: Colors.textPrimary,
		textAlign: "center",
	},
	tinderCardDescription: {
		fontSize: 24,
		color: Colors.textPrimary,
		textAlign: "left",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "95%",
		alignSelf: "center",
	},
	buttons: {
		backgroundColor: Colors.primary,
		width: "49%",
		paddingVertical: 15,
	},
	buttonsText: {
		color: "white",
		fontSize: 30,
		textAlign: "center",
	},
	skillDeck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		marginTop: 10,
		gap: 10,
		marginBottom: 10,
	},
	skillCard: {
		alignSelf: "center",
		backgroundColor: Colors.primary,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		fontSize: 24,
		color: Colors.tertiary,
	},
});

export default styles;
