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
				onPress={() => {
					goToApplications(item.postId);
				}}>
				<Text>{item.postId}</Text>
				<Text>{item.title}</Text>
				<Text>{item.postedAt.toDate().toLocaleString()}</Text>
			</Pressable>
		);
	};

	const goToApplications = (postId: string) => {
		//console.log(postList);
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

		// TODO
		// router.navigate("/newpost0");
		// go to new screen and create
		// similar flow to signup
	};

	return (
		<View style={styles.container}>
			<Pressable onPress={newPost}>
				<Text>New Post (+)</Text>
			</Pressable>
			<FlatList
				data={postList}
				renderItem={renderItem}
				contentContainerStyle={{ flexGrow: 1 }}></FlatList>
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

	// This part of the styleSheet is specific to this page
});
