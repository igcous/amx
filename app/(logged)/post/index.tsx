/*
Title: Post Start Page

Description:
    Only for Recruiter
		Make "New Post" option
		List of the posts that the Recruiter has already made
		Delete any of this posts
*/

import {
	Text,
	View,
	ListRenderItem,
	FlatList,
	Pressable,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Colors } from "../../../constants/colorPalette";
import { useRouter } from "expo-router";
import {
	doc,
	getDoc,
	updateDoc,
	deleteDoc,
	arrayRemove,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Post } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const router = useRouter();
	const [postList, setPostList] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const fetchPostList = async () => {
			if (!userDoc || !userAuth?.uid) {
				console.error("user error");
				return;
			}

			if (userDoc.publishedPosts) {
				const posts: Post[] | null = [];

				for (const postId of userDoc.publishedPosts) {
					try {
						const docSnap = await getDoc(doc(db, "posts", postId));
						if (!docSnap.exists() || !docSnap.data()) {
							// ignore
							//console.error(`Post with ID ${postId} does not exist`);
							continue;
						}
						const newPost: Post = {
							id: docSnap.id,
							title: docSnap.data().title,
							text: docSnap.data().text,
							employer: docSnap.data().employer,
							postedAt: docSnap.data().postedAt,
							postSkills: docSnap.data().jobSkills,
							applicants: docSnap.data().applicants,
							seenApplicants: docSnap.data().seenApplicants,
						};
						posts.push(newPost);
					} catch (e) {
						console.log("Error fetching user data: ", e);
						alert(e);
					}
				}
				setPostList(posts);
			}
		};

		fetchPostList();
		setLoading(false);
	}, [userDoc]);

	const deletePost = async (postId: string) => {
		try {
			setLoading(true);
			if (!userDoc || !userAuth?.uid) {
				console.error("user error is undefined");
				return;
			}

			// Delete Post
			await deleteDoc(doc(db, "posts", postId));

			// Delete reference in Published Posts
			await updateDoc(doc(db, "users", userAuth.uid), {
				publishedPosts: arrayRemove(postId),
			});

			console.log("Deleted post", postId);

			// Update the local userDoc context
			setUserDoc({
				...userDoc,
				publishedPosts: userDoc.publishedPosts.filter(
					(id: string) => id !== postId
				),
			});
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const renderItem: ListRenderItem<Post> = ({ item }) => {
		return (
			<View style={styles.item}>
				<Pressable
					style={styles.itemBody}
					onPress={() => {
						router.push({
							pathname: `/post/${item.id}`,
							params: {
								post: JSON.stringify(
									postList?.find((post) => post.id === item.id)
								),
							},
						});
					}}
					onLongPress={() => {
						router.push({
							pathname: `/post/seepost`,
							params: {
								post: JSON.stringify(
									postList?.find((post) => post.id === item.id)
								),
							},
						});
					}}>
					<View style={styles.itemHeader}>
						<Text style={styles.itemText}>{item.title}</Text>
						<Text style={styles.itemText}>
							{item.postedAt.toDate().toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Text>
					</View>

					<View style={styles.skillDeck}>
						{item.postSkills.map((skill: string, index: number) => (
							<View key={index} style={styles.skillCard}>
								<Text style={styles.skillCardText}>{skill.trim()}</Text>
							</View>
						))}
					</View>
				</Pressable>
				<Pressable
					style={styles.itemSide}
					onPress={() => {
						Alert.alert(
							"Confirm post deletion?",
							"",
							[
								{
									text: "Confirm",
									onPress: () => deletePost(item.id),
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
					<Text>X</Text>
				</Pressable>
			</View>
		);
	};

	return loading ? (
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
				<Pressable
					style={styles.topBar}
					onPress={() => {
						router.push({
							pathname: "/post/newpost",
							params: {},
						});
					}}>
					<Text style={styles.topBarText}>New Post (+)</Text>
				</Pressable>

				{postList.length === 0 ? (
					<View style={styles.info}>
						<Text style={styles.infoText}>Let's make some posts!</Text>
					</View>
				) : (
					<FlatList
						data={postList}
						renderItem={renderItem}
						contentContainerStyle={styles.list}></FlatList>
				)}
			</View>
		</View>
	);
}

/*
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
	info: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
	},
	infoText: {
		fontSize: 20,
	},
	list: {
		flexGrow: 1,
		width: "90%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	itemBody: { flex: 1 },
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
	deck: {
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
	itemSide: {},
	item: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "nowrap",
		backgroundColor: Colors.tertiary,
		padding: 16,
		borderWidth: 1,
		borderRadius: 20,
		marginBottom: 10,
	},
});
*/
