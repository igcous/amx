/*
Title: See Post Page

Description:
	Component that displays a Post, as defined in dataTypes
	Recommened use inside its own file (for Expo Router)
	Can fetch or use post data from context, depending if chatId is specified
*/

import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "../constants/colorPalette";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { PostType } from "../constants/dataTypes";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebaseConfig";

export const SeePostPage = ({
	postId,
	chatId,
}: {
	postId: string;
	chatId?: string;
}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [currentPost, setCurrentPost] = useState<PostType>();
	const { chatList } = useAuth();

	useEffect(() => {
		if (chatId) {
			const post = chatList?.find((chat) => chat.id === chatId)!.post;
			console.log(post);
			setCurrentPost(post);
		} else {
			const fetchPost = async () => {
				try {
					setLoading(true);

					const postSnap = await getDoc(doc(db, "posts", postId));
					if (postSnap.exists()) {
						const post: PostType = {
							id: postSnap.id,
							title: postSnap.data().title,
							employer: postSnap.data().employer,
							text: postSnap.data().text,
							postedAt: postSnap.data().postedAt,
							skills: postSnap.data().jobSkills,
						};
						setCurrentPost(post);
					}
				} catch (e) {
					console.log(e);
				} finally {
					setLoading(false);
				}
			};
			fetchPost();
		}
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.cardContent}>
					<Text style={styles.cardTitle}>{currentPost?.title}</Text>
					<Text style={styles.cardTitle}>{currentPost?.employer}</Text>
					<Text style={styles.cardTitle}>
						{currentPost
							? new Timestamp(
									currentPost.postedAt.seconds,
									currentPost.postedAt.nanoseconds
							  )
									.toDate()
									.toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})
							: ""}
					</Text>
				</View>
				<View style={styles.cardContent}>
					<View style={styles.skillDeck}>
						{currentPost
							? currentPost.skills.map((skill: string, index: number) => (
									<Text key={index} style={styles.skillCard}>
										{skill.trim()}
									</Text>
							  ))
							: ""}
					</View>
				</View>
				<View style={styles.cardContent}>
					<Text style={styles.cardDescription}>{currentPost?.text}</Text>
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
