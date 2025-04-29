import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	ListRenderItem,
	FlatList,
	Pressable,
	Button,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Colors } from "../../../constants/colorPalette";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

type PostSummary = {
	postId: string;
	title: string;
	postSkills: string;
	applicants: string;
	seen: string;
	postedAt: Timestamp;
};

export default function Page() {
	const { userAuth, userDoc } = useAuth();
	const router = useRouter();
	const [postList, setPostList] = useState<PostSummary[] | null>([]);
	const [currentPost, setCurrentPost] = useState<string | null>(null);

	useEffect(() => {
		const fetchPostList = async () => {
			if (!userDoc) {
				console.error("userDoc is undefined");
				return;
			}

			if (userDoc.publishedPosts) {
				const postSummaries: PostSummary[] | null = [];

				for (const postId of userDoc.publishedPosts) {
					try {
						const docSnap = await getDoc(doc(db, "posts", postId));

						const postSummary: PostSummary = {
							postId: docSnap.id,
							title: docSnap.data()?.title,
							postSkills: docSnap.data()?.jobSkills,
							applicants: docSnap.data()?.applicants,
							seen: docSnap.data()?.seenApplicants,
							postedAt: docSnap.data()?.postedAt,
						};
						console.log("Applicants: ", docSnap.data()?.applicants);
						console.log("Seen applicants: ", docSnap.data()?.seen);

						postSummaries?.push(postSummary);
					} catch (e) {
						console.log("Error fetching user data: ", e);
						alert(e);
					}
				}
				setPostList(postSummaries);
			}
		};

		fetchPostList();
	}, []);

	const renderItem: ListRenderItem<PostSummary> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					goToApplications(item.postId);
				}}>
				<View style={styles.itemHeader}>
					<Text style={styles.itemText}>{item.title}</Text>
					<Text style={styles.itemText}>
						{item.postedAt.toDate().toLocaleString()}
					</Text>
				</View>
				<Text style={styles.card}>{item.postSkills}</Text>
			</Pressable>
		);
	};

	const goToApplications = (postId: string) => {
		setCurrentPost(postId);
		router.navigate({
			pathname: `/post/${postId}`,
			params: {
				postSkills: postList?.find((post) => post.postId === postId)
					?.postSkills,
				applicants: postList?.find((post) => post.postId === postId)
					?.applicants,
				seen: postList?.find((post) => post.postId === postId)?.seen,
			},
		});
	};

	const newPost = () => {
		console.log("New Post");

		router.push({
			pathname: "/post/newpost",
			params: {},
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Pressable style={styles.topBar} onPress={newPost}>
					<Text style={styles.topBarText}>New Post (+)</Text>
				</Pressable>
				<FlatList
					data={postList}
					renderItem={renderItem}
					contentContainerStyle={styles.list}></FlatList>
			</View>
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
		justifyContent: "flex-start",
		alignItems: "center",
	},
	top: {
		width: "100%",
		marginTop: 0,
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

	// This part of the styleSheet is specific to this page
	list: {
		flexGrow: 1,
		width: "90%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	item: {
		backgroundColor: Colors.tertiary,
		padding: 16,
		borderWidth: 1,
		borderRadius: 20,
		marginBottom: 10,
	},
	itemHeader: {
		marginBottom: 10,
	},
	itemText: {
		fontSize: 18,
	},
	card: {
		alignSelf: "center",
		backgroundColor: Colors.secondary,
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		fontSize: 18,
		color: Colors.tertiary,
	},
	topBar: {
		backgroundColor: Colors.secondary,
		width: "100%",
		padding: 16,
	},
	topBarText: {
		fontSize: 24,
		textAlign: "center",
	},
});
