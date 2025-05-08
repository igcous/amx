/*
Title: Third page of the Signup flow

Description:
	Skill selection page
	Only shown to users that chose the Searcher role.

*/

import { View, ScrollView, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";
import { SkillDeck } from "../../../components/SkillDeck";
import styles from "../style";

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
		<ScrollView contentContainerStyle={styles.scrollContent}>
			<View style={styles.top}>
				<Text style={styles.title}>Field of work</Text>
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
					<Text style={styles.bottomButtonText}>CONTINUE</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}
