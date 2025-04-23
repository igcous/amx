import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { useState } from "react";

export default function Page() {
	const router = useRouter();
	const [form, setForm] = useState({
		firstname: "John",
		lastname: "Doe",
		companyname: "",
	});

	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
	const params = useLocalSearchParams();

	const validateForm = (updatedForm: typeof form) => {
		const { firstname, lastname, companyname } = updatedForm;
		if (params.role === "searcher") {
			return firstname === "" || lastname === "";
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
						style={styles.inputBox}
						placeholder="Firstname"
						value={form.firstname}
						onChangeText={(text) => handleChange("firstname", text)}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Last name</Text>
					<TextInput
						style={styles.inputBox}
						placeholder="Lastname"
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
						style={styles.inputBox}
						placeholder="Company name"
						value={form.companyname}
						onChangeText={(text) => handleChange("companyname", text)}
						autoCapitalize="none"></TextInput>
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						title="CONTINUE"
						color={Colors.secondary}
						disabled={buttonDisabled}
						onPress={() => {
							console.log("old", params);
							console.log(
								"new",
								form.firstname,
								form.lastname,
								form.companyname
							);

							router.navigate({
								pathname: params.role === "searcher" ? "/signup3" : "/signup4",
								params: {
									...params,
									firstname: form.firstname,
									lastname: form.lastname,
									...(form.companyname.trim() !== "" && {
										companyname: form.companyname,
									}),
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
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 40,
	},
});
