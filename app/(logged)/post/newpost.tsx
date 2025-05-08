/*
Title: 

Description:
    
*/

import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState, useEffect } from "react";
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import styles from "./style";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(false);
	const { userDoc, setUserDoc, userAuth } = useAuth();
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

	const createPost = async () => {
		try {
			setLoading(true);

			if (!userAuth) {
				console.log("Error");
				throw new Error();
			}

			const post = {
				title: form.title,
				text: form.description,
				jobSkills: form.skillSelection.split(","),
				employer: userDoc?.companyname,
				postedBy: userAuth?.uid,
				postedAt: Timestamp.now(),
			};
			console.log("New post", post);

			const docRef = await addDoc(collection(db, "posts"), post);
			const postId = docRef.id;
			await updateDoc(doc(db, "users", userAuth.uid), {
				publishedPosts: arrayUnion(postId), // Add the document ID to the user's publishedPosts array
			});

			// Update the local userDoc context
			const updatedPublishedPosts = userDoc?.publishedPosts
				? [...userDoc.publishedPosts, docRef.id]
				: [docRef.id];

			setUserDoc({
				...userDoc,
				publishedPosts: updatedPublishedPosts, // Update the local context
			});

			console.log(docRef);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.title}>Tell us about the job</Text>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Job Title</Text>
					<TextInput
						style={styles.inputBoxLine}
						placeholder="What is the job title?"
						value={form.title}
						onChangeText={(text) => handleChange("title", text)}
						autoCapitalize="none"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={styles.inputLabel}>Description </Text>
					<TextInput
						multiline
						editable
						numberOfLines={10}
						style={styles.inputBoxArea}
						placeholder=""
						value={form.description}
						onChangeText={(text) => handleChange("description", text)}
						autoCapitalize="none"
						textAlignVertical="top"></TextInput>
				</View>
				<View style={styles.input}>
					<Text style={[styles.inputLabel, { marginBottom: 10 }]}>
						Required skills
					</Text>

					{skillSelection ? (
						<View style={styles.skillDeck}>
							{skillSelection.split(",").map((skill: string, index: number) => (
								<Pressable
									onPress={() => {
										router.push({
											pathname: "/post/editskills",
											params: {
												title: form.title,
												description: form.description,
											},
										});
									}}
									key={index}
									style={styles.skillCard}>
									<Text style={styles.skillCardText}>{skill}</Text>
								</Pressable>
							))}
						</View>
					) : (
						<Pressable
							style={styles.choose}
							onPress={() => {
								router.push({
									pathname: "/post/editskills",
									params: {
										title: form.title,
										description: form.description,
									},
								});
							}}>
							<Text style={styles.chooseText}>Choose</Text>
						</Pressable>
					)}
				</View>
			</View>
			<View style={styles.bottom}>
				<Pressable
					style={[
						styles.bottomButton,
						{
							backgroundColor: buttonDisabled ? "gray" : Colors.secondary,
						},
					]}
					disabled={buttonDisabled}
					onPress={() => {
						createPost();
						router.replace({
							pathname: "/post",
						});
					}}>
					<Text style={styles.bottomButtonText}>CREATE POST</Text>
				</Pressable>
			</View>
		</View>
	);
}
