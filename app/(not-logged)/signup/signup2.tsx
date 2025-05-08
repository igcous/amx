/*
Title: Second page of the Signup flow

Description:
	User inputs some basic information
*/

import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";
import styles from "../style";

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
				<Text style={styles.title}>Tell us about yourself</Text>
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
					<Text style={styles.bottomButtonText}>CONTINUE</Text>
				</Pressable>
			</View>
		</View>
	);
}
