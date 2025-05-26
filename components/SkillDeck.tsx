/*
Title: Skill Deck

Description:
	Component that display a list of selectable cards (Pressables)
	Must be provided the useState skillSelection and setSkillSelection from the parent to take them outside of the component
	There is also a default styling that can be overridden
	Recommended use inside a View component
*/

import { Text, Pressable, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../constants/colorPalette";

export const SkillDeck = ({
	skillSelection = [],
	setSkillSelection = () => {},
	max = 5,
	cardStyle = {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
		borderWidth: 3,
	},
	cardTextStyle = { fontSize: 20 },
}: {
	skillSelection: string[];
	setSkillSelection: React.Dispatch<React.SetStateAction<string[]>>;
	max?: number;
	cardStyle?: ViewStyle;
	cardTextStyle?: TextStyle;
}) => {
	//TODO Store this skills somewhere persistent (DB or localfile)
	const skillList: string[] = [
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
		"SAP",
		"GraphQL",
		"Node.js",
		"Express.js",
		"Linux",
		"Elixir",
		"Bash",
	];

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

	const Card = ({ title }: { title: string }) => {
		return (
			<Pressable
				onPress={() => handleSelection(title)}
				style={{
					...cardStyle,
					borderColor: skillSelection.includes(title)
						? Colors.primary
						: Colors.background,
				}}>
				<Text style={cardTextStyle}>{title}</Text>
			</Pressable>
		);
	};

	return skillList.map((item: string) => <Card key={item} title={item} />);
};
