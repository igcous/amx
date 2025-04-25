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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../constants/colorPalette";
import { useState } from "react";

export const useSkillDeck = (max: number = 5) => {
	const [skillSelection, setSkillSelection] = useState<string[]>([]);

	const handleSelection = (value: string) => {
		const updated = skillSelection.includes(value)
			? // already selected, de-select
			  skillSelection.filter((item) => item !== value)
			: skillSelection.length < max
			? // not selected, add
			  [value, ...skillSelection]
			: skillSelection;
		setSkillSelection(updated);
	};

	return { skillSelection, handleSelection };
};

export const SkillDeck = () => {
	const { skillSelection, handleSelection } = useSkillDeck(5);

	const skills: string[] = [
		"Frontend",
		"Backend",
		"Mobile",
		"Fullstack",
		"JavaScript",
		"TypeScript",
		"React",
		"React Native",
		"Python",
		"Java",
		"C++",
		"C#",
		"PHP",
		"Ruby",
		"Go",
		"Swift",
		"Kotlin",
		"SQL",
		"MySQL",
		"MongoDB",
		"Firebase",
		"AWS",
		"Azure",
		"DevOps",
		"Machine Learning",
		"Data Science",
		"Cybersecurity",
		"UI/UX Design",
		"Agile",
		"Scrum",
	];

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

	return skills.map((item: string) => <Card key={item} title={item} />);
};

const styles = StyleSheet.create({
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
});
