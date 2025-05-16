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
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const { post } = useLocalSearchParams<{ post: string }>();
	const [currentPost, setCurrentPost] = useState(JSON.parse(post));
	const { userAuth, userDoc } = useAuth();
	const router = useRouter();
	const [applicantsList, setApplicantsList] = useState<Searcher[]>();

	useEffect(() => {
		getHistory();
	}, []);

	const getHistory = async () => {
		setLoading(true);
		try {
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
				likedApplicants: docSnap.data().seenApplicants,
			};
			setCurrentPost(updatedPost);

			let applicants: Searcher[] = [];
			if (updatedPost.seenApplicants) {
				for (const appId of updatedPost.seenApplicants) {
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

	const removeApplicant = () => {
		try {
			setLoading(true);
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
