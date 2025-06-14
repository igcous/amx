/*
Title: Applications History Page

Description:
    Shows the history and state of applications done by the Searcher
*/

import { db } from "../../../config/firebaseConfig";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { PostType } from "../../../constants/dataTypes";
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
import { useRouter } from "expo-router";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const [postList, setPostList] = useState<PostType[]>();
	const { userAuth, userDoc } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setLoading(true);
		const fetchPosts = async () => {
			if (!userDoc) {
				throw Error("userDoc not found");
			}

			if (userDoc.likedPosts) {
				const posts: PostType[] = [];

				for (const postId of userDoc.likedPosts) {
					try {
						const postSnap = await getDoc(doc(db, "posts", postId));
						if (!postSnap.exists()) {
							continue;
						}
						const post: PostType = {
							id: postSnap.id,
							title: postSnap.data().title,
							text: postSnap.data().text,
							employer: postSnap.data().employer,
							postedAt: postSnap.data().postedAt,
							skills: postSnap.data().jobSkills,
							applicants: postSnap.data().applicants,
							seenApplicants: postSnap.data().seenApplicants,
							likedApplicants: postSnap.data().likedApplicants,
						};
						console.log(post);
						posts.push(post);
					} catch (e) {
						console.error("Error while fetching posts", e);
					}
				}
				setPostList(posts);
			} else {
				setPostList([]);
			}
		};
		fetchPosts();
		setLoading(false);
	}, [userDoc]);

	const withdrawApplication = async (postId: string) => {
		try {
			setLoading(true);
			if (!userDoc || !userAuth?.uid) {
				throw Error("User or Auth is undefined");
			}
			await updateDoc(doc(db, "posts", postId), {
				applicants: arrayRemove(userAuth.uid),
				seenApplicants: arrayRemove(userAuth.uid),
				likedApplicants: arrayRemove(userAuth.uid),
			});

			await updateDoc(doc(db, "users", userAuth.uid), {
				seenPosts: arrayRemove(postId),
				likedPosts: arrayRemove(postId),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const status = (post: PostType) => {
		if (!userDoc || !userAuth?.uid) {
			return "Error";
		} else if (
			post.likedApplicants &&
			post.likedApplicants.includes(userAuth.uid)
		) {
			return "Accepted";
		} else if (
			post.seenApplicants &&
			post.seenApplicants.includes(userAuth.uid)
		) {
			return "Rejected";
		} else {
			return "Open";
		}
	};

	const renderItem: ListRenderItem<PostType> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					router.push({
						pathname: `/profile/seepost`,
						params: {
							postId: item.id,
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
						<Text style={styles.itemText}>Status: {status(item)}</Text>
					</View>
				</View>
				<Pressable
					style={styles.itemSide}
					onPress={() => {
						Alert.alert(
							"Withdraw application?",
							"",
							[
								{
									text: "Confirm",
									onPress: () => withdrawApplication(item.id),
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
				{postList.length === 0 ? (
					<View style={styles.info}>
						<Text style={styles.infoText}>Let's make some applications!</Text>
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
