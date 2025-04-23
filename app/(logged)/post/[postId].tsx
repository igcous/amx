import { Button, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
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
	const [currentApplication, setCurrentApplication] =
		useState<Application | null>(null);

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
		getApplication();
	}, [currentPost]);

	const getApplication = async () => {
		setLoading(true);
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
			console.log(currentPost.applicantIds);
			console.log(currentPost.seenApplicantIds);
			console.log(validApplicantIds);
			try {
				if (validApplicantIds.length !== 0) {
					const querySnapshot = await getDocs(
						query(
							collection(db, "users"),
							where(documentId(), "in", validApplicantIds),
							limit(1)
						)
					);
					setCurrentApplication({
						applicantId: querySnapshot.docs[0].id,
						firstname: querySnapshot.docs[0].data().firstname,
						lastname: querySnapshot.docs[0].data().lastname,
						skills: querySnapshot.docs[0].data().skills,
					});
				} else {
					setCurrentApplication(null);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
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

	const handleSubmit = async (accepted: boolean) => {
		console.log(currentApplication);
		if (!currentApplication) return; // do nothing

		if (!userAuth?.uid) {
			console.log("User Auth error, this should never happen");
			return;
		}

		const newSeenApplications = currentPost.seenApplicantIds
			? [...currentPost.seenApplicantIds, currentApplication.applicantId]
			: [currentApplication.applicantId];

		// always update seenApplications
		setCurrentPost({
			...currentPost,
			seenApplicantIds: newSeenApplications,
		});
		await updateDoc(doc(db, "posts", currentPost.id), {
			seenApplicants: newSeenApplications,
		});

		if (accepted) {
			await createChat([userAuth.uid, currentApplication.applicantId]);
		}
	};

	const createChat = async (userIds: string[]) => {
		// create chat room
		const docRef = await addDoc(collection(db, "chats"), {
			users: userIds.sort(),
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

		/*
		
			
			// TO TEST THIS
			// chat Id resolution
			// create chat Id an add to both users (searcher and recruiter)
			const docRef = await addDoc(collection(db, "chats"), {
				users: [userAuth.uid, currentApplication?.applicantId].sort(),
			});

			const newChatId = docRef.id;

			// update recruiter, add chatId
			const docSnapRecruiter = await getDoc(doc(db, "users", userAuth.uid));
			const rData = docSnapRecruiter.data()!;
			await updateDoc(doc(db, "users", userAuth.uid), {
				chatIds:
					"chatIds" in rData ? [newChatId, ...rData.chatIds] : [newChatId],
			});

			// update searcher, add chatId
			const docSnapSearcher = await getDoc(
				doc(db, "users", currentApplication!.applicantId)
			);
			const sData = docSnapSearcher.data()!;
			await updateDoc(doc(db, "users", userAuth.uid), {
				chatIds:
					"chatIds" in sData ? [newChatId, ...sData.chatIds] : [newChatId],
			});
			
		
			*/
	};

	return loading ? (
		<View>
			<Text>Loading...</Text>
		</View>
	) : currentApplication === null ? (
		<View>
			<Text>No more applications to display</Text>
		</View>
	) : (
		<View>
			<Text>{currentApplication?.firstname}</Text>
			<Text>{currentApplication?.lastname}</Text>
			<Text>{currentApplication?.skills}</Text>
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
