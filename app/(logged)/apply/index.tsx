import {
	StyleSheet,
	Text,
	View,
	Button,
	ImageBackground,
	Dimensions,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
	doc,
	addDoc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
	query,
	where,
	limit,
	documentId,
	Timestamp,
	arrayUnion,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import TinderCard from "react-tinder-card";
import React from "react";

type Post = {
	id: string;
	title: string;
	text: string;
	employer: string;
	jobSkills: string[];
	postedAt: Timestamp;
};

export default function Page() {
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const [deck, setDeck] = useState<Post[] | null>(null);

	useEffect(() => {
		// Get batches of n posts
		getPost(3);
	}, [deck === null || deck.length === 0]);
	// note: if dependancy is deck, goes on infinite loop

	/*
	useEffect(() => {
		console.log("Current Deck", deck);
	}, [deck]);
	*/

	const getPost = async (n: number) => {
		try {
			setLoading(true);
			if (!userAuth?.uid || !userDoc) {
				console.log("User Auth error, this should never happen");
				throw new Error();
			}

			const querySnapshot = userDoc.seenPosts
				? await getDocs(
						query(
							collection(db, "posts"),
							where(documentId(), "not-in", userDoc.seenPosts),
							limit(n)
						)
				  )
				: await getDocs(query(collection(db, "posts"), limit(n)));

			// Map over querySnapshot.docs to create an array of Post objects
			const posts: Post[] = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				title: doc.data().title,
				text: doc.data().text,
				employer: doc.data().employer,
				jobSkills: doc.data().jobSkills,
				postedAt: doc.data().postedAt,
			}));

			// Set the deck state with the array of Post objects
			setDeck(posts);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (post: Post, liked: boolean) => {
		// update context
		if (!userAuth?.uid || !userDoc) {
			console.log("User Auth error, this should never happen");
			throw new Error();
		}

		//console.log("Current Post ID ", post.id);
		//liked ? console.log("yes") : console.log("no");

		/*
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
		*/

		// Update Context
		setUserDoc((prevUserDoc) => ({
			...prevUserDoc,
			seenPosts: prevUserDoc?.seenPosts
				? [...prevUserDoc.seenPosts, post.id]
				: [post.id],
			likedPosts: liked
				? prevUserDoc?.likedPosts
					? [...prevUserDoc.likedPosts, post.id]
					: [post.id]
				: prevUserDoc?.likedPosts,
		}));

		// Update the deck and set the new currentPostId
		setDeck(
			(prevDeck) => prevDeck?.filter((item) => item.id !== post.id) || null
		);
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
					{deck?.map((post, index) => (
						<TinderCard
							ref={childRefs[index]}
							key={post.id}
							onSwipe={(dir) => {
								handleSubmit(post, dir === "right" ? true : false);
								//console.log("Index:", index);
							}}
							onCardLeftScreen={(dir) => {
								//console.log("onCardLeftScreen:", dir);
							}}
							preventSwipe={["up", "down"]}>
							<View style={styles.card}>
								<Text style={styles.cardTitle}>{post.id}</Text>
								<Text style={styles.cardTitle}>{post.title}</Text>
								<Text style={styles.cardTitle}>{post.employer}</Text>
							</View>
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
