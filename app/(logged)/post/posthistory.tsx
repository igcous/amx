import { db } from "../../../config/firebaseConfig";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { PostType, UserType } from "../../../constants/dataTypes";
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

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const { postId } = useLocalSearchParams<{ postId: string }>();
	const [currentPost, setCurrentPost] = useState<PostType>();
	const { userAuth, userDoc } = useAuth();
	const [applicantsList, setApplicantsList] = useState<UserType[]>();

	// Must subscribe to post
	useEffect(() => {
		setLoading(true);

		// Because of 'removeApplicant' button, must subscribe to see changes
		const unsubscribe = onSnapshot(
			doc(db, "posts", postId),
			(docSnap) => {
				if (docSnap.exists()) {
					const updatedPost: PostType = {
						id: docSnap.id,
						title: docSnap.data().title,
						text: docSnap.data().text,
						employer: docSnap.data().employer,
						postedAt: docSnap.data().postedAt,
						skills: docSnap.data().jobSkills,
						applicants: docSnap.data().applicants,
						seenApplicants: docSnap.data().seenApplicants,
						likedApplicants: docSnap.data().likedApplicants,
					};
					setCurrentPost(updatedPost);
					console.log("current post updated", updatedPost);
				} else {
					console.error("Post document does not exist or was deleted");
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
	}, []);

	useEffect(() => {
		getHistory();
	}, [currentPost]);

	const getHistory = async () => {
		setLoading(true);
		try {
			let applicants: UserType[] = [];
			if (currentPost && currentPost.seenApplicants) {
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
			console.log("Error while getting post history", e);
		} finally {
			setLoading(false);
		}
	};

	const status = (applicant: UserType) => {
		if (
			currentPost &&
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
				throw Error("User or Auth is undefined");
			}
			await updateDoc(doc(db, "posts", postId), {
				applicants: arrayRemove(applicantId),
				seenApplicants: arrayRemove(applicantId),
				likedApplicants: arrayRemove(applicantId),
			});

			await updateDoc(doc(db, "users", applicantId), {
				seenPosts: arrayRemove(postId),
				likedPosts: arrayRemove(postId),
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
				throw new Error("User does not exist or was deleted");
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

	const renderItem: ListRenderItem<UserType> = ({ item }) => {
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
						<Text style={styles.infoText}>Let's review some applications!</Text>
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
