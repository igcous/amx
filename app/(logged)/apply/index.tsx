import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
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
	const [currentPost, setCurrentPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		getPost();
	}, [userDoc]);

	const getPost = async () => {
		setLoading(true);
		try {
			const querySnapshot = userDoc?.seenPosts
				? await getDocs(
						query(
							collection(db, "posts"),
							where(documentId(), "not-in", userDoc?.seenPosts),
							limit(1)
						)
				  )
				: await getDocs(query(collection(db, "posts"), limit(1)));

			querySnapshot.docs.length === 0
				? setCurrentPost(null)
				: setCurrentPost({
						id: querySnapshot.docs[0].id,
						title: querySnapshot.docs[0].data().title,
						text: querySnapshot.docs[0].data().text,
						employer: querySnapshot.docs[0].data().employer,
						jobSkills: querySnapshot.docs[0].data().jobSkills,
						postedAt: querySnapshot.docs[0].data().postedAt,
				  });
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (liked: boolean) => {
		// update context
		if (!userAuth?.uid) {
			console.log("User Auth error, this should never happen");
			return;
		}

		const newSeenPosts = userDoc?.seenPosts
			? [...userDoc?.seenPosts, currentPost?.id]
			: [currentPost?.id];

		if (liked) {
			// update both seenPosts and likedPosts
			const newLikedPosts = userDoc?.likedPosts
				? [...userDoc?.likedPosts, currentPost?.id]
				: [currentPost?.id];
			setUserDoc({
				...userDoc,
				seenPosts: newSeenPosts,
				likedPosts: newLikedPosts,
			});
			await updateDoc(doc(db, "users", userAuth.uid), {
				seenPosts: newSeenPosts,
				likedPosts: newLikedPosts,
			});

			// Add the user ID to the applicants field in the post document using arrayUnion
			if (currentPost?.id) {
				await updateDoc(doc(db, "posts", currentPost.id), {
					applicants: arrayUnion(userAuth.uid),
				});
			}
		} else {
			// update just seenPosts
			setUserDoc({ ...userDoc, seenPosts: newSeenPosts });
			await updateDoc(doc(db, "users", userAuth.uid), {
				seenPosts: newSeenPosts,
			});
		}
		// note: avoid using two continuos setters (weird behaviour), better to keep all in one
	};

	return loading ? (
		<View>
			<Text>Loading...</Text>
		</View>
	) : currentPost === null ? (
		<View>
			<Text>No more posts to display</Text>
		</View>
	) : (
		<View>
			<Text>{currentPost?.title}</Text>
			<Text>{currentPost?.text}</Text>
			<Text>{currentPost?.employer}</Text>
			<Button title="Yes" onPress={() => handleSubmit(true)} />
			<Button title="No" onPress={() => handleSubmit(false)} />
		</View>
	);
}

const styles = StyleSheet.create({
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
});
