/*
Title: Chat Styling

Description:
    Common styling for the Chat pages
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

	// index
	info: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
	},
	infoText: {
		fontSize: 20,
	},
	list: {
		flexGrow: 1,
		marginTop: 10,
		width: "95%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
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
		flexDirection: "row",
		justifyContent: "flex-start",
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
	profilePic: {
		width: width * 0.1,
		height: width * 0.1,
		alignSelf: "center",
	},

	// [chatId]
	chatContainer: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	chatBarContainer: {
		backgroundColor: Colors.tertiary,
		padding: 16,
		width: "100%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	chatBar: {
		flexDirection: "row",
		gap: 10,
	},
	chatBarText: {
		fontSize: 24,
		verticalAlign: "middle",
	},
});

export default styles;
