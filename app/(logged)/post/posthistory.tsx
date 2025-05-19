import { db } from "../../../config/firebaseConfig";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Post, Searcher } from "../../../constants/dataTypes";
import styles from "./style";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	ListRenderItem,
	Pressable,
	View,
	Text,
} from "react-native";
import { Colors } from "../../../constants/colorPalette";
import { useLocalSearchParams } from "expo-router";
import {
	arrayRemove,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";
import { unsubscribe } from "diagnostics_channel";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const { post } = useLocalSearchParams<{ post: string }>();
	const [currentPost, setCurrentPost] = useState(JSON.parse(post));
	const { userAuth, userDoc } = useAuth();
	const [applicantsList, setApplicantsList] = useState<Searcher[]>();

	// Must subscribe to post
	useEffect(() => {
		setLoading(true);

		const fetchPost = async () => {
			// Get post again, in case applicants has updated
			const docSnap = await getDoc(doc(db, "posts", currentPost.id));
			if (!docSnap.exists() || !docSnap.data()) {
				// ignore
				//console.error(`Post with ID ${postId} does not exist`);
				throw Error;
			}

			const updatedPost: Post = {
				id: docSnap.id,
				title: docSnap.data().title,
				text: docSnap.data().text,
				employer: docSnap.data().employer,
				postedAt: docSnap.data().postedAt,
				postSkills: docSnap.data().jobSkills,
				applicants: docSnap.data().applicants,
				seenApplicants: docSnap.data().seenApplicants,
				likedApplicants: docSnap.data().likedApplicants,
			};
			console.log("updated post");
			setCurrentPost(updatedPost);
		};
		fetchPost();
		/*
		const unsubscribe = onSnapshot(
			doc(db, "posts", currentPost.id),
			(docSnap) => {
				if (docSnap.exists()) {
					const updatedPost: Post = {
						id: docSnap.id,
						title: docSnap.data().title,
						text: docSnap.data().text,
						employer: docSnap.data().employer,
						postedAt: docSnap.data().postedAt,
						postSkills: docSnap.data().jobSkills,
						applicants: docSnap.data().applicants,
						seenApplicants: docSnap.data().seenApplicants,
						likedApplicants: docSnap.data().likedApplicants,
					};
					setCurrentPost(updatedPost);
					console.log("current post updated", updatedPost);
				} else {
					console.error("Post document does not exist");
				}
			},
			(error) => {
				console.error("Error listening to user document:", error);
			}
		);

		setLoading(false);

		return () => {
			unsubscribe();
		};
		*/
	}, []);

	useEffect(() => {
		getHistory();
		console.log("updated history");
	}, [currentPost]);

	const getHistory = async () => {
		setLoading(true);
		try {
			let applicants: Searcher[] = [];
			if (currentPost.seenApplicants) {
				for (const appId of currentPost.seenApplicants) {
					const appSnap = await getDoc(doc(db, "users", appId));
					if (!appSnap.exists() || !appSnap.data()) {
						continue;
					}
					applicants.push({
						id: appSnap.id,
						firstname: appSnap.data().firstname,
						lastname: appSnap.data().lastname,
						skills: appSnap.data().skills,
						email: appSnap.data().email,
						cv: appSnap.data().resumeURL,
					});
				}
			}
			setApplicantsList(applicants);
		} catch (e) {
			console.log("Error while getting Post History", e);
		} finally {
			setLoading(false);
		}
	};

	const status = (applicant: Searcher) => {
		if (
			currentPost.likedApplicants &&
			currentPost.likedApplicants.includes(applicant.id)
		) {
			return "Accepted";
		} else {
			return "Rejected";
		}
	};

	const removeApplicant = async (applicantId: string) => {
		try {
			setLoading(true);
			if (!userDoc || !userAuth?.uid) {
				console.error("user error is undefined");
				return;
			}
			await updateDoc(doc(db, "posts", currentPost.id), {
				applicants: arrayRemove(applicantId),
				seenApplicants: arrayRemove(applicantId),
				likedApplicants: arrayRemove(applicantId),
			});

			await updateDoc(doc(db, "users", applicantId), {
				seenPosts: arrayRemove(currentPost.id),
				likedPosts: arrayRemove(currentPost.id),
			});
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const downloadCV = async (applicantId: string) => {
		try {
			const docSnap = await getDoc(doc(db, "users", applicantId));
			if (!docSnap.exists()) {
				throw new Error("User does not exist");
			}
			const resumeURL = docSnap.data()?.resumeURL;
			if (resumeURL) {
				const result = await WebBrowser.openBrowserAsync(resumeURL);
				console.log("Browser result:", result);
			} else {
				alert("No uploaded CV found.");
			}
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	const renderItem: ListRenderItem<Searcher> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					downloadCV(item.id);
				}}>
				<View style={styles.itemBody}>
					<View style={styles.itemHeader}>
						<Text style={styles.itemText}>
							{item.firstname} {item.lastname}
						</Text>

						<Text style={styles.itemText}>Status: {status(item)}</Text>
					</View>
				</View>
				<Pressable
					style={styles.itemSide}
					onPress={() => {
						Alert.alert(
							"Remove applicant?",
							"",
							[
								{
									text: "Confirm",
									onPress: () => removeApplicant(item.id),
									style: "default",
								},
								{
									text: "Cancel",
									style: "cancel",
								},
							],
							{
								cancelable: true,
							}
						);
					}}>
					<Text
						style={[styles.itemText, { fontWeight: "bold", color: "black" }]}>
						X
					</Text>
				</Pressable>
			</Pressable>
		);
	};

	return !applicantsList || loading ? (
		<ActivityIndicator
			size="large"
			color={Colors.primary}
			style={{
				flex: 1,
				backgroundColor: Colors.background,
				justifyContent: "center",
				alignItems: "center",
				transform: [{ scale: 2 }],
			}}
		/>
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				{applicantsList.length === 0 ? (
					<View style={styles.info}>
						<Text style={styles.infoText}>Let's review some posts!</Text>
					</View>
				) : (
					<FlatList
						data={applicantsList}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.list}></FlatList>
				)}
			</View>
		</View>
	);
}
