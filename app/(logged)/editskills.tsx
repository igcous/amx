import {
	StyleSheet,
	Text,
	View,
	Pressable,
	ScrollView,
	Button,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [skillSelection, setSkillSelection] = useState<string[]>([]);
	const n = 5;
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const handleSelection = (value: string) => {
		setButtonDisabled(false);
		if (skillSelection.includes(value)) {
			const updated = skillSelection.filter((item) => item !== value);
			setSkillSelection(updated);
		} else {
			if (skillSelection.length < n) {
				setSkillSelection([value, ...skillSelection]);
			}
		}
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

	const updateUserDoc = async () => {
		setLoading(true);

		// update user doc in the database
		console.log("Data to store:", skillSelection);
		console.log("Type: ", typeof skillSelection);
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
					<Text style={styles.titleText}>Field of work</Text>
					<Text style={styles.descriptionText}>
						Choose your skill of expertise (max {n})
					</Text>
					<View style={styles.deck}>
						{/* TODO Store this skills in DB*/}
						<Card title="Front-End" />
						<Card title="Back-End" />
						<Card title="Databases" />
						<Card title="Mobile" />
						<Card title="Full-Stack" />
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
							title="SAVE CHANGES"
							color={Colors.secondary}
							disabled={buttonDisabled}
							onPress={() => {
								updateUserDoc();
								router.navigate("/profile");
							}}></Button>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	// I will try to keep at least a part of the styleSheet that is repeatable
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

	// This is the styleSheet that is specific to this page
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
		marginBottom: 20,
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
	},
});
