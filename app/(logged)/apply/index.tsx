/*
Title: Apply Page

Description:
    Only for Searcher
		Swipe on job post suggestions

*/

import { Text, View, Pressable, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
	getDocs,
	collection,
	query,
	limit,
	updateDoc,
	arrayUnion,
	doc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import TinderCard from "react-tinder-card";
import React from "react";
import { useRouter } from "expo-router";
import { PostType } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const { userAuth, userDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const [deck, setDeck] = useState<PostType[]>();
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const router = useRouter();

	useEffect(() => {
		getPosts();
	}, [currentIndex < 0]);

	const getPosts = async () => {
		try {
			setLoading(true);
			if (!userAuth || !userDoc) {
				throw Error("User or Auth is undefined");
			}

			const querySnapshot = await getDocs(
				query(collection(db, "posts"), limit(100))
			);

			if (querySnapshot && querySnapshot.size > 0) {
				// TODO: Set a query startAfter, to paginate doc retrieval

				// Filter out posts that are in userDoc.seenPosts
				const filteredDocs = userDoc.seenPosts
					? querySnapshot.docs.filter(
							(doc) => !userDoc.seenPosts.includes(doc.id)
					  )
					: querySnapshot.docs;

				// Map over querySnapshot.docs to create an array of Post objects
				const posts: PostType[] = filteredDocs.map((doc) => ({
					id: doc.id,
					title: doc.data().title,
					employer: doc.data().employer,
					text: doc.data().text,
					postedAt: doc.data().postedAt,
					skills: doc.data().jobSkills,
				}));

				// Calculate matching index and sort posts in ascending order
				const sortedPosts = posts
					.map((post) => ({
						...post,
						matchingIndex: matchingIndex(post.skills, userDoc?.skills),
					}))
					.sort((a, b) => a.matchingIndex - b.matchingIndex); // Sort by matching index (ascending, deck is then reversed)

				setDeck(sortedPosts);
				setCurrentIndex(sortedPosts.length - 1);
			} else {
				setDeck([]);
				setCurrentIndex(0);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (post: PostType, liked: boolean) => {
		if (!userAuth?.uid || !userDoc) {
			throw new Error("User or Auth error, this should never happen");
		}

		// Firebase update
		if (liked) {
			await updateDoc(doc(db, "users", userAuth.uid), {
				seenPosts: arrayUnion(post.id),
				likedPosts: arrayUnion(post.id),
			});
			// Add the user ID to the applicants field in the post document using arrayUnion
			if (post.id) {
				await updateDoc(doc(db, "posts", post.id), {
					applicants: arrayUnion(userAuth.uid),
				});
			}
		} else {
			await updateDoc(doc(db, "users", userAuth.uid), {
				seenPosts: arrayUnion(post.id),
			});
		}
	};

	// From react-tinder-card Advanced Example
	// https://github.com/3DJakob/react-native-tinder-card-demo/blob/master/src/examples/Advanced.js
	// This is used only to swipe programmatically
	const childRefs = useMemo(
		() =>
			Array(deck?.length)
				.fill(0)
				.map(() => React.createRef<any>()),
		[deck]
	);

	const swipe = async (dir: string) => {
		if (deck) {
			if (currentIndex < deck.length) {
				await childRefs[currentIndex].current.swipe(dir);
			}
		}
	};

	const matchingIndex = (jobskills: string[], userskills: string[]) => {
		return Math.round(
			(100 * jobskills.filter((skill) => userskills.includes(skill)).length) /
				jobskills.length
		);
	};

	return !userDoc || loading ? (
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
	) : !deck || deck?.length === 0 ? (
		<View style={styles.container}>
			<View style={styles.info}>
				<Text style={styles.infoText}>No more job posts to display</Text>
				<Pressable
					style={[
						styles.reload,
						{
							backgroundColor:
								userDoc?.role === "recruiter"
									? Colors.secondary
									: Colors.primary,
						},
					]}
					onPress={() => getPosts()}>
					<Text style={styles.reloadText}>Reload</Text>
				</Pressable>
			</View>
		</View>
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.tinderCardContainer}>
					{deck?.map((post, index) => (
						<TinderCard
							ref={childRefs[index]}
							key={post.id}
							onSwipe={(dir) => {
								if (dir === "right") {
									Alert.alert(
										"Confirm job application?",
										"",
										[
											{
												text: "Confirm",
												onPress: () => {
													setCurrentIndex(index - 1);
													handleSubmit(post, true);
												},
												style: "default",
											},
											{
												text: "Cancel",
												onPress: async () => {
													setCurrentIndex(index);
													await childRefs[index].current.restoreCard();
												},
												style: "cancel",
											},
										],
										{
											cancelable: false,
										}
									);
								} else {
									setCurrentIndex(index - 1);
									handleSubmit(post, false);
								}
							}}
							onCardLeftScreen={(dir) => {
								//console.log("onCardLeftScreen:", dir);
							}}
							preventSwipe={["up", "down"]}>
							<Pressable
								style={styles.tinderCard}
								onPress={() => {
									console.log(post.id);
									router.navigate({
										pathname: `/apply/seepost`,
										params: {
											postId: post.id,
										},
									});
								}}>
								<View style={styles.tinderCardContent}>
									<Text style={styles.tinderCardText}>{post.title}</Text>
									<Text style={styles.tinderCardText}>{post.employer}</Text>
									<Text style={styles.tinderCardText}>
										{post.postedAt.toDate().toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</Text>
								</View>
								<View style={styles.tinderCardContent}>
									<View style={styles.skillDeck}>
										{post.skills.map((skill: string, index: number) => (
											<Text key={index} style={styles.skillCard}>
												{skill.trim()}
											</Text>
										))}
									</View>
								</View>
								<View style={styles.tinderCardContent}>
									<Text style={styles.tinderCardText}>
										{"Matching: " +
											matchingIndex(post.skills, userDoc?.skills) +
											"%"}
									</Text>
								</View>

								<View style={styles.tinderCardContent}>
									<Text
										style={styles.tinderCardDescription}
										numberOfLines={6}
										ellipsizeMode="tail">
										{post.text}
									</Text>
								</View>
							</Pressable>
						</TinderCard>
					))}
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.buttonsContainer}>
					<Pressable style={styles.buttons} onPress={() => swipe("left")}>
						<Text style={styles.buttonsText}>NO</Text>
					</Pressable>
					<Pressable style={styles.buttons} onPress={() => swipe("right")}>
						<Text style={styles.buttonsText}>YES</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
