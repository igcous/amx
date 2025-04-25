/*
Title: Fourth page of the Signup flow

Description:
	User input email and password, made as simple as possible

TODO:
	Add Google Login here
	Terms and Conditions Page
*/

import { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Button,
	Pressable,
	ActivityIndicator,
} from "react-native";
import { Colors } from "../../../constants/colorPalette";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Page() {
	const [form, setForm] = useState({
		email: "test@mail.com",
		password: "123456",
		repeatPassword: "123456",
	});
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const params = useLocalSearchParams();

	useEffect(() => {
		// Only for debug
		console.log("Current params", params);
	}, []);

	const signup = async () => {
		try {
			setLoading(true);

			const email = form.email;
			const password = form.password;
			// Need the new user ID to create a document with it in Firestore
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Remove sensitive data (password) from params
			const { password: _a, skills: _b, ...filteredParams } = params;
			const as = params.skills as string; // This is needed because of the way Expo handles params
			const skills = as.split(",");

			await setDoc(doc(db, "users", userCredential.user.uid), {
				skills,
				...filteredParams,
			});

			console.log("Added user with ID: ", userCredential.user.uid);
		} catch (e: any) {
			if (e.code === "auth/email-already-in-use") {
				alert("The email address is already in use.");
			} else {
				console.log("Signup failed:", e);
				alert("An error occurred during signup. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Unified validation function
	const validateForm = (updatedForm: typeof form) => {
		const { email, password, repeatPassword } = updatedForm;
		return (
			email === "" ||
			password === "" ||
			repeatPassword === "" ||
			password !== repeatPassword
		);
	};

	// Unified handler for input changes
	const handleChange = (field: keyof typeof form, value: string) => {
		const updatedForm = { ...form, [field]: value }; // get the new form, otherwise for has the old render valuea
		setForm(updatedForm);
		setButtonDisabled(validateForm(updatedForm));
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.titleText}>SIGNUP PAGE</Text>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>E-mail</Text>
					<TextInput
						style={styles.inputBox}
						placeholder="Email"
						value={form.email}
						onChangeText={(text) => handleChange("email", text)}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Password</Text>
					<TextInput
						style={styles.inputBox}
						placeholder="Password"
						value={form.password}
						onChangeText={(text) => handleChange("password", text)}
						autoCapitalize="none"
						secureTextEntry></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Repeat password</Text>
					<TextInput
						style={{
							...styles.inputBox,
							color:
								form.password !== form.repeatPassword
									? Colors.secondary
									: Colors.textPrimary,
						}}
						placeholder="Repeat password"
						value={form.repeatPassword}
						onChangeText={(text) => handleChange("repeatPassword", text)}
						autoCapitalize="none"
						secureTextEntry></TextInput>
				</View>
				<View style={styles.input}>
					<Pressable
						onPress={() => {
							// TODO: Go to Terms and Conditions Page
						}}>
						<Text style={styles.terms}>Terms and Conditions</Text>
					</Pressable>
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						title="CREATE ACCOUNT"
						disabled={buttonDisabled}
						color={Colors.secondary}
						onPress={signup}></Button>
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
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		color: Colors.secondary,
		marginBottom: 40,
	},
	terms: {
		fontSize: 20,
		textDecorationLine: "underline",
		color: Colors.primary,
	},
	/* unused
	activityIndicator: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: Colors.background,
		transform: [{ scale: 3 }],
	},
	*/
});
