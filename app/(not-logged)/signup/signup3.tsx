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

export default function Page() {
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [skillSelection, setSkillSelection] = useState<string[]>([]);
	const params = useLocalSearchParams();
	const n = 5;

	useEffect(() => {
		// Only for debug
		console.log("Current params", params);
	}, []);

	const handleSelection = (value: string) => {
		const updated = skillSelection.includes(value)
			? // already selected, de-select
			  skillSelection.filter((item) => item !== value)
			: skillSelection.length < n
			? // not selected, add
			  [value, ...skillSelection]
			: skillSelection;
		setSkillSelection(updated);
		setButtonDisabled(updated.length === 0);
	};

	const Card = ({ title }: { title: string }) => {
		return (
			<Pressable
				onPress={() => handleSelection(title)}
				style={{
					...styles.card,
					borderColor: skillSelection.includes(title)
						? Colors.primary
						: Colors.background,
				}}>
				<Text style={styles.cardText}>{title}</Text>
			</Pressable>
		);
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>Field of work</Text>
					<Text style={styles.descriptionText}>
						Choose your skill of expertise (max {n})
					</Text>
					<View style={styles.deck}>
						{/* TODO Store this skills somewhere persistent (DB or localfile)*/}
						<Card title="Front-End" />
						<Card title="Back-End" />
						<Card title="Databases" />
						<Card title="Mobile" />
						<Card title="Full-Stack" />
						<Card title="JavaScript" />
						<Card title="TypeScript" />
						<Card title="HTML" />
						<Card title="Security" />
						<Card title="Java" />
						<Card title="C#" />
						<Card title="MySQL" />
						<Card title="AWS" />
						<Card title="Agile" />
						<Card title="SAP" />
						<Card title="React" />
						<Card title="React Native" />
						<Card title="Kotlin" />
						<Card title="Spring Boot" />
						<Card title="Python" />
						<Card title="Machine Learning" />
						<Card title="Lua" />
						<Card title="Rust" />
						<Card title="C++" />
						<Card title="PHP" />
						<Card title="Go" />
						<Card title="Ruby" />
						<Card title="Pascal" />
						<Card title="Bash" />
						<Card title="C" />
					</View>
				</View>
				<View style={styles.bottom}>
					<View style={styles.bottomButton}>
						<Button
							title="CONTINUE"
							color={Colors.secondary}
							disabled={buttonDisabled}
							onPress={() => {
								console.log("Old params", params);
								console.log("New params", skillSelection);
								router.push({
									pathname: "/signup/signup4",
									params: { ...params, skills: skillSelection.join(",") },
								});
							}}></Button>
					</View>
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
