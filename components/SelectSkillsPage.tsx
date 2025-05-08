/*
Title: Edit Skills Page

Description:
    Based on the Skill Deck component, similar to what is done on Signup (signup3.tsx)
*/

import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../constants/colorPalette";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { SkillDeck } from "./SkillDeck";

export const SelectSkillsPage = ({
	goBackTo,
	textHeader,
	textDescription,
	saveToUserDoc,
	color,
}: {
	goBackTo: string;
	textHeader: string;
	textDescription: string;
	saveToUserDoc: boolean;
	color: string;
}) => {
	const router = useRouter();
	const [skillSelection, setSkillSelection] = useState<string[]>([]);
	const n = 5;
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const params = useLocalSearchParams();

	useEffect(() => {
		console.log("Current params", params);
		console.log("Skill selection", skillSelection);
		console.log(typeof skillSelection);
	}, []);

	const updateUserDoc = async () => {
		setLoading(true);

		// Update user doc in the database
		try {
			if (userAuth?.uid) {
				// the fact that users can be null gives all these extra checks
				await updateDoc(doc(db, "users", userAuth.uid), {
					skills: skillSelection,
				});
				if (userDoc) {
					const { skills: _, ...rest } = userDoc; // get and remove skills
					setUserDoc({ skills: skillSelection, ...rest }); // add the new skills
				}
			} else {
				console.error("User ID is undefined");
			}
		} catch (e) {
			console.error("Error editing document: ", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>{textHeader}</Text>
					<Text style={styles.descriptionText}>
						{textDescription} (max {n})
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
							if (saveToUserDoc) updateUserDoc();
							router.replace({
								pathname: goBackTo,
								// mirror back params (only useful for string type)
								params: {
									...params,
									skillSelection: skillSelection,
								},
							}); // replace to destroy, cant go back
						}}>
						<Text style={styles.buttonText}>CONTINUE</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
};

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
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 20,
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
