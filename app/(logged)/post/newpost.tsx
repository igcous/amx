/*
Title: 

Description:
    
*/

import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ScrollView,
	Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const { title, description, skillSelection } = useLocalSearchParams<{
		title: string;
		description: string;
		skillSelection: string;
	}>();

	const [form, setForm] = useState<{
		title: string;
		description: string;
		skillSelection: string;
	}>({
		title: title,
		description: description,
		skillSelection: skillSelection,
	});

	// Only for debug
	const params = useLocalSearchParams();
	useEffect(() => {
		console.log("Current params", params);
		console.log("Skill selection", skillSelection);
		console.log(typeof skillSelection);
	}, []);

	const validateForm = (updatedForm: typeof form) => {
		const { title, description } = updatedForm;
		return title === "" || description === "" || !skillSelection;
	};
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(
		validateForm(form)
	);

	// Unified handler for input changes
	const handleChange = (field: keyof typeof form, value: string) => {
		const updatedForm = { ...form, [field]: value }; // get the new form, otherwise for has the old render valuea
		setForm(updatedForm);
		setButtonDisabled(validateForm(updatedForm));
	};

	const createPost = () => {
		try {
			setLoading(true);

			// Create Post document and add it to user publishedPosts
		} catch {
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>Tell us about the job</Text>
					<View style={styles.inputSmall}>
						<Text style={styles.inputLabel}>Job Title</Text>
						<TextInput
							style={styles.inputLine}
							placeholder="What is the job title?"
							value={form.title}
							onChangeText={(text) => handleChange("title", text)}
							autoCapitalize="none"></TextInput>
					</View>
					<View style={styles.inputBig}>
						<Text style={styles.inputLabel}>Description </Text>
						<TextInput
							multiline
							editable
							numberOfLines={10}
							style={styles.inputBox}
							placeholder=""
							value={form.description}
							onChangeText={(text) => handleChange("description", text)}
							autoCapitalize="none"
							textAlignVertical="top"></TextInput>
					</View>
					<View style={styles.inputSmall}>
						<Text style={styles.inputLabel}>Required skills</Text>

						<Pressable
							onPress={() => {
								router.push({
									pathname: "/post/editskills",
									params: {
										title: form.title,
										description: form.description,
									},
								});
							}}>
							{skillSelection ? (
								<View style={styles.deck}>
									{skillSelection
										.split(",")
										.map((skill: string, index: number) => (
											<Pressable
												onPress={() => {
													router.push({
														pathname: "/post/editskills",
													});
												}}
												key={index}
												style={styles.card}>
												<Text style={styles.cardText}>{skill}</Text>
											</Pressable>
										))}
								</View>
							) : (
								<Pressable
									style={styles.choose}
									onPress={() => {
										router.push({
											pathname: "/post/editskills",
										});
									}}>
									<Text style={styles.chooseText}>Choose</Text>
								</Pressable>
							)}
						</Pressable>
					</View>
				</View>
				<View style={styles.bottom}>
					<View style={styles.bottomButton}>
						<Button
							title="CREATE POST"
							color={Colors.primary}
							disabled={buttonDisabled}
							onPress={() => {
								router.replace({
									pathname: "/post",
								});
							}}></Button>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollContent: {
		width: "100%",
		flexGrow: 1,
	},
	top: {
		width: "100%",
		marginTop: 40,
		gap: 20,
		flex: 1,
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
	inputSmall: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 10,
		flex: 1,
	},
	inputBig: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 10,
		flex: 2,
	},
	inputLabel: {
		fontSize: 20,
	},
	inputLine: {
		width: "100%",
		textAlign: "center",
		borderBottomWidth: 4,
		borderBottomColor: Colors.primary,
		borderRadius: 5,
		alignSelf: "center",
		fontSize: 16,
	},
	inputBox: {
		marginTop: 10,
		backgroundColor: Colors.tertiary,
		width: "100%",
		height: 120,
		fontSize: 16,
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 20,
	},
	card: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
		borderWidth: 3,
	},
	cardText: {
		fontSize: 20,
	},
	deck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		marginTop: 10,
		marginBottom: 10,
	},
	choose: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.secondary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
	},
	chooseText: {
		fontSize: 20,
		color: Colors.tertiary,
	},
});
