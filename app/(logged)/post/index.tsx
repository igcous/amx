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
import { PostType } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const { userAuth, userDoc } = useAuth();
	const router = useRouter();
	const [postList, setPostList] = useState<PostType[]>();
	const [loading, setLoading] = useState(true);
	const [displayPick, setDisplayPick] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		const fetchPostList = async () => {
			if (!userDoc || !userAuth?.uid) {
				throw Error("User or Auth is undefined");
			}

			if (userDoc.publishedPosts) {
				const posts: PostType[] = [];

				for (const postId of userDoc.publishedPosts) {
					try {
						const docSnap = await getDoc(doc(db, "posts", postId));
						if (!docSnap.exists() || !docSnap.data()) {
							continue; // ignore
						}
						const newPost: PostType = {
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
						posts.push(newPost);
					} catch (e) {
						console.error("Error fetching user data: ", e);
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
				throw Error("User or Auth is undefined");
			}

			// Delete Post
			await deleteDoc(doc(db, "posts", postId));

			// Delete reference in Published Posts
			await updateDoc(doc(db, "users", userAuth.uid), {
				publishedPosts: arrayRemove(postId),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const renderItem: ListRenderItem<PostType> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					if (displayPick === item.id) {
						setDisplayPick(null);
					} else {
						setDisplayPick(item.id);
					}
				}}>
				{displayPick === item.id ? (
					<View style={styles.pickOptions}>
						<Pressable
							onPress={() => {
								setDisplayPick(null);
								router.push({
									pathname: `/post/${item.id}`,
									params: {
										post: JSON.stringify(
											postList?.find((post) => post.id === item.id)
										),
									},
								});
							}}
							style={[styles.pickOption]}>
							<Text style={styles.pickOptionText}>Review applications</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								setDisplayPick(null);
								router.push({
									pathname: "/post/seepost",
									params: {
										postId: item.id,
									},
								});
							}}
							style={styles.pickOption}>
							<Text style={styles.pickOptionText}>See post</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								setDisplayPick(null);
								router.push({
									pathname: "/post/posthistory",
									params: {
										postId: item.id,
									},
								});
							}}
							style={styles.pickOption}>
							<Text style={styles.pickOptionText}>Applications history</Text>
						</Pressable>
					</View>
				) : (
					<></>
				)}

				<View
					style={[
						styles.itemBody,
						{ opacity: displayPick === item.id ? 0 : 100 },
					]}>
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
						{item.skills.map((skill: string, index: number) => (
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
