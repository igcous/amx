/*
Title: Post List Page

Description:
	Page only shown to users with 'Recruiter' role
	Displays a deck of swipeable cards that belong to Searchers that applied for the selected Job Post
*/

import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useState, useEffect, useMemo } from "react";
import * as WebBrowser from "expo-web-browser";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import {
	doc,
	collection,
	addDoc,
	updateDoc,
	arrayUnion,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import TinderCard from "react-tinder-card";
import React from "react";
import { UserType, PostType } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const [deck, setDeck] = useState<UserType[]>();
	const { post } = useLocalSearchParams<{ post: string }>();
	const [currentPost, setCurrentPost] = useState(JSON.parse(post));
	const [currentIndex, setCurrentIndex] = useState<number>(-1);

	useEffect(() => {
		getApplications();
	}, [currentIndex < 0]);

	const getApplications = async () => {
		try {
			setLoading(true);

			// Get post again, in case applicants has changed
			const docSnap = await getDoc(doc(db, "posts", currentPost.id));
			if (!docSnap.exists() || !docSnap.data()) {
				throw Error("Post does not exist or was deleted");
			}
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

			// Filter out seen applicants
			const validApplicants =
				updatedPost.seenApplicants && updatedPost.applicants
					? updatedPost.applicants.filter(
							(id: string) => !updatedPost.seenApplicants?.includes(id)
					  )
					: updatedPost.applicants;

			if (validApplicants && validApplicants.length !== 0) {
				let applicants: UserType[] = [];
				// TODO: limit number of valid applicants fetched
				for (const appId of validApplicants) {
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

				// Calculate matching index and sort posts in ascending order
				const sortedApplicants = applicants
					.map((applicant) => ({
						...applicant,
						matchingIndex: matchingIndex(currentPost.skills, applicant.skills),
					}))
					.sort((a, b) => a.matchingIndex - b.matchingIndex); // Sort by matching index (ascending, deck is then reversed)

				setDeck(sortedApplicants);
				setCurrentIndex(sortedApplicants.length - 1);
			} else {
				setDeck([]);
				setCurrentIndex(0); // non-negative
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (applicant: UserType, liked: boolean) => {
		if (!userAuth?.uid || !userDoc) {
			throw new Error("User or Auth error, this should never happen");
		}

		// Firebase update
		if (liked) {
			await updateDoc(doc(db, "posts", currentPost.id), {
				seenApplicants: arrayUnion(applicant.id),
				likedApplcants: arrayUnion(applicant.id),
			});
			await createChat(userAuth.uid, applicant.id);
		} else {
			await updateDoc(doc(db, "posts", currentPost.id), {
				seenApplicants: arrayUnion(applicant.id),
			});
		}
	};

	const createChat = async (recruiter: string, applicant: string) => {
		// Create chat room
		try {
			setLoading(true);
			const docRef = await addDoc(collection(db, "chats"), {
				users: [recruiter, applicant],
				postId: currentPost.id,
			});
			const newChatId = docRef.id;

			// Add chat id to users
			[recruiter, applicant].forEach(async (user) => {
				await updateDoc(doc(db, "users", user), {
					chatIds: arrayUnion(newChatId),
				});
			});

			Alert.alert(
				"Matched!",
				"",
				[
					{
						text: "Go to chat",
						onPress: () => {
							router.replace({
								pathname: `/chats/${newChatId}`,
								params: {},
							});
						},
						style: "default",
					},
					{
						text: "Keep swiping",
						style: "cancel",
					},
				],
				{
					cancelable: false,
				}
			);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
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
	const downloadCV = async (applicantId: string) => {
		try {
			const docSnap = await getDoc(doc(db, "users", applicantId));

			const resumeURL = docSnap.data()?.resumeURL;
			if (resumeURL) {
				const result = await WebBrowser.openBrowserAsync(resumeURL);
				//console.log("Browser result:", result);
			} else {
				alert("No uploaded CV found.");
			}
		} catch (error) {
			console.error("Error downloading file:", error);
			alert("Failed to download the file. Please try again.");
		}
	};

	const matchingIndex = (jobskills: string[], userskills: string[]) => {
		return Math.round(
			(100 * jobskills.filter((skill) => userskills.includes(skill)).length) /
				jobskills.length
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
	) : !deck || deck?.length === 0 ? (
		<View style={styles.container}>
			<View style={styles.info}>
				<Text style={styles.infoText}>
					No more applicants for this job post
				</Text>
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
					onPress={() => getApplications()}>
					<Text style={styles.reloadText}>Reload</Text>
				</Pressable>
			</View>
		</View>
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.tinderCardContainer}>
					{deck?.map((applicant, index) => (
						<TinderCard
							ref={childRefs[index]}
							key={applicant.id}
							onSwipe={(dir) => {
								if (dir === "right") {
									Alert.alert(
										`Connect with ${applicant.firstname} ${applicant.lastname}?`,
										"",
										[
											{
												text: "Confirm",
												onPress: () => {
													setCurrentIndex(index - 1);
													handleSubmit(applicant, true);
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
									handleSubmit(applicant, false);
								}
							}}
							onCardLeftScreen={(dir) => {
								//console.log("onCardLeftScreen:", dir);
							}}
							preventSwipe={["up", "down"]}>
							<Pressable
								style={styles.tinderCard}
								onPress={() => {
									router.navigate({
										pathname: `/post/seepost`,
										params: {
											post: post,
										},
									});
								}}>
								<View style={styles.tinderCardContent}>
									<Text style={styles.tinderCardText}>
										{applicant.firstname + " " + applicant.lastname}
									</Text>
								</View>

								<View style={styles.tinderCardContent}>
									<View style={styles.skillDeck}>
										{applicant.skills.map((skill: string, index: number) => (
											<Text key={index} style={styles.skillCard}>
												{skill.trim()}
											</Text>
										))}
									</View>
								</View>

								<View style={styles.tinderCardContent}>
									<Text style={styles.tinderCardText}>
										{"Matching: " +
											matchingIndex(currentPost.skills, applicant.skills) +
											"%"}
									</Text>
								</View>

								<View style={styles.tinderCardContent}>
									<Pressable
										onPress={() => downloadCV(applicant.id)}
										style={styles.downloadLink}>
										<Text style={styles.downloadLinkText}>Download CV</Text>
									</Pressable>
								</View>
							</Pressable>
						</TinderCard>
					))}
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.buttonsYesNoContainer}>
					<Pressable style={styles.buttonsYesNo} onPress={() => swipe("left")}>
						<Text style={styles.buttonsYesNoText}>NO</Text>
					</Pressable>
					<Pressable style={styles.buttonsYesNo} onPress={() => swipe("right")}>
						<Text style={styles.buttonsYesNoText}>YES</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
