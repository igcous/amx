/*
Title: Style for Signup

Description:
	Defines a common styling for the Post pages

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

	// New Post
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
	input: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 40,
	},
	inputLabel: {
		fontSize: 20,
	},

	// inputBoxLine is the same as inputBox in Signup 2
	inputBoxLine: {
		width: "100%",
		textAlign: "center",
		borderBottomWidth: 4,
		borderBottomColor: Colors.secondary,
		borderRadius: 5,
		alignSelf: "center",
		fontSize: 20,
	},
	inputBoxArea: {
		marginTop: 10,
		backgroundColor: Colors.tertiary,
		width: "100%",
		height: 120,
		fontSize: 16,
	},
	title: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 40,
	},

	// Same as in Profile and Apply
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
		backgroundColor: Colors.secondary,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		fontSize: 24,
		color: Colors.tertiary,
	},
	choose: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.secondary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
	},
	chooseText: {
		fontSize: 20,
		color: Colors.tertiary,
	},

	// [postId]
	// same as Apply Page
	info: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
		gap: 20,
	},
	infoText: {
		fontSize: 20,
	},
	reload: {
		padding: 5,
		borderRadius: 20,
	},
	reloadText: {
		color: "white",
		textAlign: "center",
		fontSize: 30,
	},
	tinderCardContainer: {
		flex: 1,
		borderWidth: 0,
		justifyContent: "flex-start",
		//backgroundColor: "red",
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
	buttonsYesNoContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "95%",
		alignSelf: "center",
	},
	buttonsYesNo: {
		backgroundColor: Colors.secondary,
		width: "49%",
		paddingVertical: 15,
	},
	buttonsYesNoText: {
		color: "white",
		fontSize: 30,
		textAlign: "center",
	},
	downloadLink: {
		backgroundColor: Colors.secondary,
		padding: 5,
		marginBottom: 20,
	},
	downloadLinkText: {
		fontSize: 30,
		color: "white",
		textAlign: "center",
	},

	// index
	list: {
		flexGrow: 1,
		width: "90%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	topBar: {
		backgroundColor: Colors.secondary,
		width: "100%",
		padding: 16,
	},
	topBarText: {
		fontSize: 24,
		textAlign: "center",
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
