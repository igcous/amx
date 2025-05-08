/*
Title: Login page

Description:
	Email and password input
*/

import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Colors } from "../../constants/colorPalette";
import styles from "./style";

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
				<Text style={styles.title}>Welcome</Text>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>E-mail</Text>
					<TextInput
						style={[styles.inputBox, { borderBottomColor: Colors.primary }]}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Password</Text>
					<TextInput
						style={[styles.inputBox, { borderBottomColor: Colors.primary }]}
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
					<Text style={styles.bottomButtonText}>CONTINUE</Text>
				</Pressable>
			</View>
		</View>
	);
}
