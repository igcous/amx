import {
	Button,
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import {
	doc,
	getDoc,
	getDocs,
	collection,
	where,
	addDoc,
	query,
	limit,
	updateDoc,
	orderBy,
	documentId,
	arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import TinderCard from "react-tinder-card";
import React from "react";

type Application = {
	applicantId: string;
	firstname: string;
	lastname: string;
	skills: string[];
};

type Post = {
	id: string;
	postSkills: string[];
	applicantIds: string[];
	seenApplicantIds: string[];
};

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	/*const [currentApplication, setCurrentApplication] =
		useState<Application | null>(null);*/
	const [deck, setDeck] = useState<Application[] | null>(null);

	const params = useLocalSearchParams();

	const [currentPost, setCurrentPost] = useState<Post>({
		id: params.postId.toString(),
		postSkills: params.postSkills
			? params.postSkills.toString().split(",")
			: [],
		applicantIds: params.applicants
			? params.applicants.toString().split(",")
			: [],
		seenApplicantIds: params.seen ? params.seen.toString().split(",") : [],
	});

	useEffect(() => {
		// Get batches of n applicants
		getApplication(3);
	}, [currentPost]);

	const getApplication = async (n: number) => {
		try {
			// notes
			// 1. have to get applications in an orderly way (skill matching)
			// 2. applicantsIds with all the user ids for the job is available
			// 3. check for applicantIds string or string[]

			setLoading(true);

			// Filter out seen applicants
			const validApplicantIds = currentPost.applicantIds.filter(
				(id) => !currentPost.seenApplicantIds.includes(id)
			);

			if (validApplicantIds.length !== 0) {
				const querySnapshot = await getDocs(
					query(
						collection(db, "users"),
						where(documentId(), "in", validApplicantIds),
						limit(n)
					)
				);

				const applications: Application[] = querySnapshot.docs.map((doc) => ({
					applicantId: doc.id,
					firstname: doc.data().firstname,
					lastname: doc.data().lastname,
					skills: doc.data().skills,
				}));

				setDeck(applications);
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

	const handleSubmit = async (application: Application, liked: boolean) => {
		if (!userAuth?.uid || !userDoc) {
			console.log("User Auth error, this should never happen");
			throw new Error();
		}

		// Firebase update
		await updateDoc(doc(db, "posts", currentPost.id), {
			seenApplicants: currentPost.seenApplicantIds
				? [...currentPost.seenApplicantIds, application.applicantId]
				: [application.applicantId],
		});

		// Context update
		setCurrentPost({
			...currentPost,
			seenApplicantIds: currentPost.seenApplicantIds
				? [...currentPost.seenApplicantIds, application.applicantId]
				: [application.applicantId],
		});
		setDeck(
			(prevDeck) =>
				prevDeck?.filter(
					(item) => item.applicantId !== application.applicantId
				) || null
		);

		if (liked) {
			await createChat([userAuth.uid, application.applicantId]);
		}
	};

	const createChat = async (userIds: string[]) => {
		// create chat room
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

		// update context
		setUserDoc({ ...userDoc, chatIds: [...userDoc?.chatIds, newChatId] });
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

	return loading ? (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.info}>
					<Text style={styles.infoText}>Loading...</Text>
				</View>
			</View>
		</View>
	) : deck === null || deck?.length === 0 ? (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.info}>
					<Text style={styles.infoText}>No more posts to display</Text>
				</View>
			</View>
		</View>
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.cardContainer}>
					{deck?.map((application, index) => (
						<TinderCard
							ref={childRefs[index]}
							key={application.applicantId}
							onSwipe={(dir) => {
								handleSubmit(application, dir === "right" ? true : false);
								//console.log("Index:", index);
							}}
							onCardLeftScreen={(dir) => {
								//console.log("onCardLeftScreen:", dir);
							}}
							preventSwipe={["up", "down"]}>
							<Pressable
								style={styles.card}
								onPress={() => {
									router.navigate({
										pathname: `/post/seeprofile`,
										params: { application: JSON.stringify(application) },
									});
								}}>
								<Text style={styles.cardTitle}>{application.applicantId}</Text>
								<Text style={styles.cardTitle}>{application.firstname}</Text>
								<Text style={styles.cardTitle}>{application.lastname}</Text>
							</Pressable>
						</TinderCard>
					))}
				</View>
				<View style={styles.buttons}>
					<Button title="Yes" onPress={() => swipe("right")}></Button>
					<Button title="No" onPress={() => swipe("left")}></Button>
				</View>
			</View>
		</View>
	);
}

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
	info: { alignSelf: "center" },
	infoText: { fontSize: 20 },
	cardContainer: {
		flex: 1,
	},
	card: {
		position: "absolute",
		backgroundColor: Colors.secondary,
		width: "90%",
		alignSelf: "center",
		height: 0.5 * height,
		borderRadius: 20,
		shadowColor: "black",
		shadowOpacity: 0.2,
		shadowRadius: 20,
		resizeMode: "cover",
		justifyContent: "space-around",
		alignContent: "center",
	},
	cardImage: {},
	cardTitle: {
		textAlign: "center",
		fontSize: 20,
		color: Colors.textPrimary,
	},
	buttons: {},
});
