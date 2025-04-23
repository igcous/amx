import { View, Text, Button, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState } from "react";

export default function Page() {
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [roleSelection, setRoleSelection] = useState<string | null>(null);
	const params = useLocalSearchParams();

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
							console.log("old", params);
							console.log("new", roleSelection);
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
	// I will try to keep at least a part of the styleSheet that is repeatable
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

	// This is the styleSheet that is specific to this page
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
