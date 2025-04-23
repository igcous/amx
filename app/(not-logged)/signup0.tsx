import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useLocalSearchParams, useRouter } from "expo-router";

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

	// TODO check used mail without the full signup

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
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						title="CONTINUE"
						disabled={buttonDisabled}
						color={Colors.secondary}
						onPress={() => {
							console.log("new", form.email, form.password);
							router.navigate({
								pathname: "/signup1",
								params: {
									...params,
									email: form.email,
									password: form.password,
								},
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
});
