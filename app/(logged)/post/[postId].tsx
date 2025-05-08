import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useState, useEffect, useMemo } from "react";
import * as WebBrowser from "expo-web-browser";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import {
	doc,
	getDocs,
	collection,
	where,
	addDoc,
	query,
	limit,
	updateDoc,
	documentId,
	arrayUnion,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import TinderCard from "react-tinder-card";
import React from "react";
import { Searcher } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const [deck, setDeck] = useState<Searcher[] | null>(null);
	const { post } = useLocalSearchParams<{ post: string }>();
	const [currentPost, setCurrentPost] = useState(JSON.parse(post));

	useEffect(() => {
		console.log(userDoc);
	}, []);

	useEffect(() => {
		// Get batches of n applicants
		getApplication(3);
	}, [currentPost]);

	const getApplication = async (n: number) => {
		try {
			setLoading(true);

			// Filter out seen applicants
			const validApplicants = currentPost.seenApplicants
				? currentPost.applicants.filter(
						(id: string) => !currentPost.seenApplicants.includes(id)
				  )
				: currentPost.applicants;

			if (currentPost.applicants && validApplicants.length !== 0) {
				const querySnapshot = await getDocs(
					query(
						collection(db, "users"),
						where(documentId(), "in", validApplicants),
						limit(n)
					)
				);

				const applicants: Searcher[] = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					firstname: doc.data().firstname,
					lastname: doc.data().lastname,
					skills: doc.data().skills,
					email: doc.data().email,
				}));

				setDeck(applicants);
			}

			/* TO TEST
			const data = querySnapshot.docs.map((doc) => doc.data());
			data.sort((a, b) => {
				let aCount = 0;
				let bCount = 0;
				for (let i = 0; i < postSkills.length; i++) {
					aCount += a.skills.includes(postSkills[i]) ? 1 : 0;
					bCount += b.skills.includes(postSkills[i]) ? 1 : 0;
				}
				return aCount > bCount ? 1 : aCount === bCount ? 0 : -1;
			});
			*/
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (applicant: Searcher, liked: boolean) => {
		if (!userAuth?.uid || !userDoc) {
			console.log("User Auth error, this should never happen");
			throw new Error();
		}

		// Firebase update
		await updateDoc(doc(db, "posts", currentPost.id), {
			seenApplicants: currentPost.seenApplicants
				? [...currentPost.seenApplicants, applicant.id]
				: [applicant.id],
		});

		// Context update
		setCurrentPost({
			...currentPost,
			seenApplicants: currentPost.seenApplicants
				? [...currentPost.seenApplicants, applicant.id]
				: [applicant.id],
		});
		setDeck(
			(prevDeck) => prevDeck?.filter((item) => item.id !== applicant.id) || null
		);

		if (liked) {
			alert("Matched!");
			await createChat([userAuth.uid, applicant.id]);
		}
	};

	const createChat = async (userIds: string[]) => {
		// create chat room
		try {
			setLoading(true);
			const docRef = await addDoc(collection(db, "chats"), {
				users: userIds.sort(),
				postId: currentPost.id,
			});
			const newChatId = docRef.id;

			// add chat id to users
			userIds.forEach(async (user) => {
				await updateDoc(doc(db, "users", user), {
					chatIds: arrayUnion(newChatId),
				});
			});

			// Update Context
			setUserDoc((prevUserDoc) => ({
				...prevUserDoc,
				chatIds: prevUserDoc?.chatIds
					? [...prevUserDoc.chatIds, newChatId]
					: [newChatId],
			}));
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
	const swipe = (dir: string) => {
		if (deck) {
			if (childRefs[deck.length - 1]?.current) {
				childRefs[deck.length - 1].current.swipe(dir);
			} else {
				console.error("Reference for card is undefined");
			}
		}
	};

	const downloadCV = async (applicantId: string) => {
		try {
			const docSnap = await getDoc(doc(db, "users", applicantId));

			const resumeURL = docSnap.data()?.resumeURL;
			if (resumeURL) {
				const result = await WebBrowser.openBrowserAsync(resumeURL);
				console.log("Browser result:", result);
			} else {
				alert("No uploaded CV found.");
			}
		} catch (error) {
			console.error("Error downloading file:", error);
			alert("Failed to download the file. Please try again.");
		}
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
	) : deck === null || deck?.length === 0 ? (
		<View style={styles.container}>
			<View style={styles.info}>
				<Text style={styles.infoText}>
					No more applicants for this job post
				</Text>
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
								handleSubmit(applicant, dir === "right" ? true : false);
								//console.log("Index:", index);
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
									<Pressable
										onPress={() => downloadCV(applicant.id)}
										style={styles.downloadLink}>
										<Text style={styles.downloadLinkText}>Download CV</Text>
									</Pressable>
									{/*<Pressable onPress={() => {}} style={styles.link}>
										<Text style={styles.linkText}>See job post</Text>
									</Pressable>*/}
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

/*
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	top: {
		width: "100%",
		marginTop: 40,
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
	cardContainer: {
		flex: 1,
		borderWidth: 0,
		justifyContent: "flex-start",
		//backgroundColor: "red",
	},
	card: {
		flex: 1,
		position: "absolute",
		backgroundColor: Colors.tertiary,
		width: "95%",
		height: 0.7 * height,
		alignSelf: "center",
		justifyContent: "space-around",
		borderWidth: 2,
		borderRadius: 20,
	},
	cardImage: {},
	cardContent: {
		width: "90%",
		alignSelf: "center",
	},
	cardTitle: {
		fontSize: 30,
		color: Colors.textPrimary,
		textAlign: "center",
	},
	cardDescription: {
		fontSize: 24,
		color: Colors.textPrimary,
		textAlign: "left",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "95%",
		alignSelf: "center",
	},
	buttons: {
		backgroundColor: Colors.secondary,
		width: "49%",
		paddingVertical: 15,
	},
	buttonsText: {
		color: "white",
		fontSize: 30,
		textAlign: "center",
	},
	skillDeck: {
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
	skillCard: {
		alignSelf: "center",
		backgroundColor: Colors.secondary,
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		fontSize: 24,
		color: Colors.tertiary,
	},
	link: {
		backgroundColor: Colors.secondary,
		padding: 5,
		marginBottom: 20,
	},
	linkText: {
		fontSize: 30,
		color: "white",
		textAlign: "center",
	},
});
*/
