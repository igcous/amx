/*
Title: Skill Deck

Description:

*/

import {
	View,
	ScrollView,
	Text,
	Button,
	Pressable,
	StyleSheet,
} from "react-native";
import { useSkillDeck, SkillDeck } from "../../components/skillDeck";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { useState, useEffect } from "react";

export default function Page() {
	const router = useRouter();
	const [skillSelection, setSkillSelection] = useState<string[]>([]);
	const params = useLocalSearchParams();
	const n = 5;

	return (
		<View style={styles.deck}>
			<SkillDeck />
		</View>
	);
}

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollContent: {
		width: "100%",
		flexGrow: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	top: {
		width: "100%",
		marginTop: 40,
		gap: 20,
	},
	bottom: {
		width: "100%",
		marginBottom: 40,
	},
	bottomButton: {
		alignSelf: "center",
		width: "90%",
		gap: 20,
	},

	// This part of the styleSheet is specific to this page
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
		borderBottomColor: Colors.secondary,
		alignSelf: "center",
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 10,
	},
	descriptionText: {
		width: "90%",
		fontSize: 20,
		alignSelf: "center",
		marginBottom: 10,
	},
	card: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
		borderWidth: 3,
	},
	cardText: {
		fontSize: 20,
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
});
