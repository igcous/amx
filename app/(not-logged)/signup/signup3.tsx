/*
Title: Third page of the Signup flow

Description:
	Skill selection page
	Only shown to users that chose the Searcher role.

*/

import {
	View,
	ScrollView,
	Text,
	Button,
	Pressable,
	StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";
import { SkillDeck } from "../../../components/skillDeck";

export default function Page() {
	const router = useRouter();
	const [skillSelection, setSkillSelection] = useState<string[]>([]);
	const params = useLocalSearchParams();
	const n = 5;

	useEffect(() => {
		// Only for debug
		console.log("Current params", params);
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>Field of work</Text>
					<Text style={styles.descriptionText}>
						Choose your skill of expertise (max {n})
					</Text>
					<View style={styles.deck}>
						<SkillDeck
							skillSelection={skillSelection}
							setSkillSelection={setSkillSelection}
							max={n}
						/>
					</View>
				</View>
				<View style={styles.bottom}>
					<Pressable
						style={[
							styles.bottomButton,
							{
								backgroundColor:
									skillSelection.length === 0 ? "gray" : Colors.primary,
							},
						]}
						disabled={skillSelection.length === 0}
						onPress={() => {
							console.log("Old params", params);
							console.log("New params", skillSelection);
							router.push({
								pathname: "/signup/signup4",
								params: { ...params, skills: skillSelection.join(",") },
							});
						}}>
						<Text style={styles.buttonText}>CONTINUE</Text>
					</Pressable>
				</View>
			</ScrollView>
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
		gap: 20,
	},
	bottomButton: {
		alignSelf: "center",
		width: "90%",
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
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
