/*
Title: See Post Page

Description:
	Component that displays a Post, as defined in dataTypes
	Repeatable
	Recommened use inside its own file (for Expo Router)
*/

import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState } from "react";
import { Colors } from "../constants/colorPalette";
import { Timestamp } from "firebase/firestore";

export const SeePostPage = ({ post }: { post: string }) => {
	const [currentPost, setCurrentPost] = useState(JSON.parse(post));

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.cardContent}>
					<Text style={styles.cardTitle}>{currentPost.title}</Text>
					<Text style={styles.cardTitle}>{currentPost.employer}</Text>
					<Text style={styles.cardTitle}>
						{new Timestamp(
							currentPost.postedAt.seconds,
							currentPost.postedAt.nanoseconds
						)
							.toDate()
							.toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
					</Text>
				</View>
				<View style={styles.cardContent}>
					<View style={styles.skillDeck}>
						{currentPost.postSkills.map((skill: string, index: number) => (
							<Text key={index} style={styles.skillCard}>
								{skill.trim()}
							</Text>
						))}
					</View>
				</View>
				<View style={styles.cardContent}>
					<Text style={styles.cardDescription}>{currentPost.text}</Text>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollContent: {
		width: "100%",
		flexGrow: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		marginTop: 40,
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

	cardContent: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 20,
	},
	cardTitle: {
		fontSize: 30,
		color: Colors.textPrimary,
		textAlign: "center",
	},
	cardDescription: {
		fontSize: 24,
		color: Colors.textPrimary,
		textAlign: "justify",
	},
	skillDeck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		marginTop: 10,
		gap: 10,
		marginBottom: 10,
	},
	skillCard: {
		alignSelf: "center",
		backgroundColor: Colors.secondary,
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		fontSize: 24,
		color: Colors.tertiary,
	},
});
