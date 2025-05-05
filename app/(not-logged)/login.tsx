/*
Title: Login page

Description:
	Email and password input
*/

import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../constants/colorPalette";

export default function Page() {
	const [email, setEmail] = useState<string>("test@mail.com");
	const [password, setPassword] = useState<string>("123456");
	const [loading, setLoading] = useState<boolean>(true);

	const login = async () => {
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
		} catch (e) {
			console.log("Login failed:", e);
			alert(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.titleText}>WELCOME</Text>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>E-mail</Text>
					<TextInput
						style={styles.inputBox}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Password</Text>
					<TextInput
						style={styles.inputBox}
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						autoCapitalize="none"
						secureTextEntry></TextInput>
				</View>
			</View>
			<View style={styles.bottom}>
				<Pressable
					style={[styles.bottomButton, { backgroundColor: Colors.primary }]}
					disabled={false}
					onPress={() => login()}>
					<Text style={styles.buttonText}>CONTINUE</Text>
				</Pressable>
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
		borderBottomColor: Colors.primary,
		alignSelf: "center",
		fontSize: 20,
	},
	titleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		color: Colors.primary,
		marginBottom: 40,
	},
});
