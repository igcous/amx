import { View, Text, Button, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { useState } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Page() {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const params = useLocalSearchParams();

	const signup = async () => {
		// signup with auth
		try {
			setLoading(true);

			// need to parse query parameters from expo-router "as string"
			const email = params.email as string;
			const password = params.password as string;
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			); // need to get this ID for Firestore

			const { password: _a, skills: _b, ...filteredParams } = params; // remove
			const as = params.skills as string; // string | string[], is this because of Expo?
			const skills = as.split(",");

			await setDoc(doc(db, "users", userCredential.user.uid), {
				skills,
				...filteredParams, // Spread the filtered params besides 'skills' and 'password' (not included)
			});

			console.log("Added user with ID: ", userCredential.user.uid);
		} catch (e: any) {
			console.log("Signup failed:", e);
			alert(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/*<Button
				title="Test"
				onPress={() => {
					console.log(params);
					console.log(params.skills);
					const a = params.skills as string;
					console.log(a.split(","));
				}}></Button>*/}

			<View style={styles.top}>
				<Text style={styles.titleText}>Terms and Conditions</Text>
				<Text style={styles.descriptionText}>All your data belongs to me!</Text>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						title="CREATE ACCOUNT"
						color={Colors.secondary}
						disabled={loading}
						onPress={() => {
							signup();
						}}></Button>
				</View>
			</View>
		</View>
	);
}

// TODO: Firebase security rules
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
*/

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
});
