/*
Title: Second page of the Signup flow

Description:
	User inputs some basic information
*/

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";

export default function Page() {
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const params = useLocalSearchParams();
	const router = useRouter();
	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		companyname: "",
	});

	useEffect(() => {
		// Only for debug
		console.log("Current params", params);
	}, []);

	const validateForm = (updatedForm: typeof form) => {
		const { firstname, lastname, companyname } = updatedForm;
		if (params.role === "searcher") {
			return firstname === "" || lastname === "";
			// Company name is optional for recruiters
		} else {
			return firstname === "" || lastname === "" || companyname === "";
		}
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
				<Text style={styles.titleText}>Tell us about yourself</Text>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>First Name</Text>
					<TextInput
						style={[
							styles.inputBox,
							{
								borderBottomColor:
									params.role === "recruiter"
										? Colors.secondary
										: Colors.primary,
							},
						]}
						placeholder="What is your name?"
						value={form.firstname}
						onChangeText={(text) => handleChange("firstname", text)}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Last name</Text>
					<TextInput
						style={[
							styles.inputBox,
							{
								borderBottomColor:
									params.role === "recruiter"
										? Colors.secondary
										: Colors.primary,
							},
						]}
						placeholder="What is your last name?"
						value={form.lastname}
						onChangeText={(text) => handleChange("lastname", text)}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					{params.role === "searcher" ? (
						<Text style={styles.inputLabel}>Company name (optional)</Text>
					) : (
						<Text style={styles.inputLabel}>Company name</Text>
					)}
					<TextInput
						style={[
							styles.inputBox,
							{
								borderBottomColor:
									params.role === "recruiter"
										? Colors.secondary
										: Colors.primary,
							},
						]}
						placeholder="Where do you work?"
						value={form.companyname}
						onChangeText={(text) => handleChange("companyname", text)}
						autoCapitalize="none"></TextInput>
				</View>
			</View>
			<View style={styles.bottom}>
				<Pressable
					style={[
						styles.bottomButton,
						{
							backgroundColor: buttonDisabled
								? "gray"
								: params.role === "recruiter"
								? Colors.secondary
								: Colors.primary,
						},
					]}
					disabled={buttonDisabled}
					onPress={() => {
						console.log("Old params", params);
						console.log(
							"New params",
							form.firstname,
							form.lastname,
							form.companyname
						);

						router.navigate({
							pathname:
								params.role === "searcher"
									? "/signup/signup3" // no skills choice
									: "/signup/signup4",
							params: {
								...params,
								firstname: form.firstname,
								lastname: form.lastname,
								// companyname may be optional
								...(form.companyname.trim() !== "" && {
									companyname: form.companyname,
								}),
							},
						});
					}}>
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
		alignSelf: "center",
		fontSize: 20,
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 40,
	},
});
