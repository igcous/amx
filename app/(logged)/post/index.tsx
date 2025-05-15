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
	const [postList, setPostList] = useState<Post[]>();
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
			} else {
				setPostList([]);
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
			<Pressable
				style={styles.item}
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
				<View style={styles.itemBody}>
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
							<Text key={index} style={styles.skillCard}>
								{skill.trim()}
							</Text>
						))}
					</View>
				</View>
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
					<Text
						style={[styles.itemText, { fontWeight: "bold", color: "black" }]}>
						X
					</Text>
				</Pressable>
			</Pressable>
		);
	};

	return !postList || loading ? (
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
					<Text style={[styles.topBarText, { color: "white" }]}>
						New Post (+)
					</Text>
				</Pressable>

				{postList.length === 0 ? (
					<View style={styles.info}>
						<Text style={styles.infoText}>Let's make some posts!</Text>
					</View>
				) : (
					<FlatList
						data={postList}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.list}></FlatList>
				)}
			</View>
		</View>
	);
}
