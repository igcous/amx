/*
Title: Login page

Description:
	Email and password input
*/

import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useRouter } from "expo-router";

export default function Page() {
	const [email, setEmail] = useState<string>("test@mail.com");
	const [password, setPassword] = useState<string>("123456");
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

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
				<Text style={styles.titleText}>LOGIN PAGE</Text>
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
				<View style={styles.bottomButton}>
					<Button
						title="CONTINUE"
						color={Colors.primary}
						disabled={false}
						onPress={() => login()}></Button>
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
	},
	titleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		color: Colors.primary,
		marginBottom: 40,
	},
});
