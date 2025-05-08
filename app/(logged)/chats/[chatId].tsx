import { Text, View, Pressable } from "react-native";
import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { db } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot,
	getDoc,
	doc,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Post } from "../../../constants/dataTypes";
import * as WebBrowser from "expo-web-browser";
import styles from "./style";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const { userAuth, userDoc } = useAuth();
	const { chatUser, postId } = useLocalSearchParams<{
		chatUser: string;
		postId: string;
	}>();
	const [currentChatUser, setCurrentChatUser] = useState(JSON.parse(chatUser));
	const router = useRouter();
	const [imageSource, setImageSource] = useState(
		currentChatUser.picURL
			? {
					uri: currentChatUser.picURL.replace(
						`images/profile/`,
						`images%2Fprofile%2F`
					),
			  }
			: require("../../../assets/profile_icon.svg")
	);
	const [currentPost, setCurrentPost] = useState<Post | null>(null);

	useEffect(() => {
		//console.log(postId);
		getPost();
	}, []);

	const getPost = async () => {
		try {
			setLoading(true);
			const postSnap = await getDoc(doc(db, "posts", postId));
			if (postSnap.exists()) {
				const post: Post = {
					id: postSnap.id,
					title: postSnap.data().title,
					employer: postSnap.data().employer,
					text: postSnap.data().text,
					postedAt: postSnap.data().postedAt,
					postSkills: postSnap.data().jobSkills,
					applicants: [],
					seenApplicants: [],
				};
				//console.log(post);
				setCurrentPost(post);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	useLayoutEffect(() => {
		const q = query(
			collection(db, `chats/${currentChatUser.chatId}/messages`),
			orderBy("createdAt", "desc")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			//console.log("snapshot");
			setMessages(
				snapshot.docs.map((doc) => ({
					// this is the format of IMessage
					_id: doc.id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user,
				}))
			);
		});
		return () => unsubscribe();
	}, []);

	// this is on GiftedChat basic example
	const handleSend = useCallback((messages: IMessage[]) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, messages)
		);

		const { _id, createdAt, text, user } = messages[0];
		addDoc(collection(db, `chats/${currentChatUser.chatId}/messages`), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	const downloadCV = async (applicantId: string) => {
		try {
			const docSnap = await getDoc(doc(db, "users", applicantId));
			if (!docSnap.exists()) {
				throw new Error("User does not exist");
			}
			const resumeURL = docSnap.data()?.resumeURL;
			if (resumeURL) {
				const result = await WebBrowser.openBrowserAsync(resumeURL);
				console.log("Browser result:", result);
			} else {
				alert("No uploaded CV found.");
			}
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<View style={styles.chatContainer}>
			<View style={styles.top}>
				<View
					style={[
						styles.chatBarContainer,
						{ backgroundColor: Colors.secondary },
					]}>
					<Pressable
						style={styles.chatBar}
						onPress={() => {
							if (userDoc?.role === "recruiter") {
								downloadCV(currentChatUser.id);
							}
						}}>
						<Image
							contentFit="cover"
							source={imageSource}
							style={styles.profilePic}
							onError={() => {
								setImageSource(require("../../../assets/profile_icon.svg"));
							}}
						/>
						<Text style={[styles.chatBarText, { color: "white" }]}>
							{currentChatUser.firstname} {currentChatUser.lastname}
						</Text>
					</Pressable>
				</View>
				<View style={styles.chatBarContainer}>
					<Pressable
						style={styles.chatBar}
						onPress={() => {
							router.navigate({
								pathname: "/chats/seepost",
								params: {
									post: JSON.stringify(currentPost),
								},
							});
						}}>
						{userDoc?.role === "searcher" ? (
							<Text style={styles.chatBarText}>
								{currentChatUser.jobtitle} job post{"\n"}
								{currentChatUser.companyname}
							</Text>
						) : (
							<Text style={styles.chatBarText}>
								Applied as{"\n"}
								{currentChatUser.jobtitle}
							</Text>
						)}
					</Pressable>
				</View>
			</View>
			<GiftedChat
				messages={messages}
				onSend={(messages) => handleSend(messages)}
				user={{ _id: userAuth!.uid }}
			/>
		</View>
	);
}
