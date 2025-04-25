/*
Title: First page of the Signup flow

Description:
	User chooses a role, Searcher or Recruiter

*/

import { View, Text, Button, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";

export default function Page() {
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [roleSelection, setRoleSelection] = useState<string | null>(null);
	const params = useLocalSearchParams();

	useEffect(() => {
		// Only for debug
		console.log("Current params", params);
	}, []);

	const handleSelection = (value: string) => {
		setButtonDisabled(false);
		setRoleSelection(value);
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.titleText}>You are...</Text>
				<Pressable
					onPress={() => handleSelection("searcher")}
					style={{
						...styles.card,
						borderColor:
							roleSelection === "searcher" ? Colors.primary : Colors.background,
					}}>
					<Text style={styles.cardText}>Looking for a job</Text>
				</Pressable>
				<Pressable
					onPress={() => handleSelection("recruiter")}
					style={{
						...styles.card,
						borderColor:
							roleSelection === "recruiter"
								? Colors.primary
								: Colors.background,
					}}>
					<Text style={styles.cardText}>Looking to hire</Text>
				</Pressable>
			</View>

			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						title="CONTINUE"
						color={Colors.secondary}
						disabled={buttonDisabled}
						onPress={() => {
							console.log("Old params", params);
							console.log("New params", roleSelection);
							router.push({
								pathname: "/signup/signup2",
								params: { ...params, role: roleSelection },
							});
						}}></Button>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
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
	card: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 20,
		backgroundColor: Colors.tertiary,
		padding: 20,
		borderRadius: 30,
		borderWidth: 3,
	},
	cardText: {
		fontSize: 20,
		textAlign: "center",
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 40,
	},
});
