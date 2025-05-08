import {
	Text,
	View,
	ListRenderItem,
	FlatList,
	Pressable,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { ChatUser } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [chatList, setChatList] = useState<ChatUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		const fetchChatList = async () => {
			if (!userDoc) {
				console.error("userDoc is undefined");
				return;
			}

			if (userDoc.chatIds) {
				const chatUsers: ChatUser[] = [];

				for (const chatId of userDoc.chatIds) {
					try {
						const chatSnap = await getDoc(doc(db, "chats", chatId));
						if (!chatSnap.exists()) {
							// ignore
							continue;
						}

						// assume 1-on-1 chats
						const userToFetch =
							chatSnap.data()?.users[0] === userAuth?.uid
								? chatSnap.data()?.users[1]
								: chatSnap.data()?.users[0];

						// get other user info
						const userDocSnap = await getDoc(doc(db, "users", userToFetch));
						if (!userDocSnap.exists()) {
							// ignore
							continue;
						}

						// fetch post info
						const postId = chatSnap.data().postId;
						const postSnap = await getDoc(doc(db, "posts", postId));
						if (!postSnap.exists()) {
							// ignore
							continue;
						}

						const chatUser: ChatUser = {
							id: userToFetch,
							chatId: chatId,
							postId: postId,
							firstname: userDocSnap.data().firstname,
							lastname: userDocSnap.data().lastname,
							companyname: userDocSnap.data().companyname,
							jobtitle: postSnap.data().title,
							picURL: userDocSnap.data().profilePicURL,
						};
						//console.log(chatUser.picURL);
						chatUsers.push(chatUser);
					} catch (e) {
						console.error("Error fetching user data:", e);
						alert(e);
					}
				}
				setChatList(chatUsers);
			}
		};
		fetchChatList();
		setLoading(false);
	}, [userDoc]);

	const renderItem: ListRenderItem<ChatUser> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					//console.log(item.chatId);
					router.push({
						pathname: `/chats/${item.chatId}`,
						params: {
							chatUser: JSON.stringify(item),
							postId: item.postId,
						},
					});
				}}>
				<View style={styles.itemBody}>
					<View style={styles.itemHeader}>
						{item.picURL ? (
							<Image
								contentFit="cover"
								source={{ uri: item.picURL }}
								style={styles.profilePic}
							/>
						) : (
							// Fallback when there is no image
							<Image
								contentFit="contain"
								source={require("../../../assets/profile_icon.svg")}
								style={styles.profilePic}
							/>
						)}
						<Text style={styles.itemText}>
							{item.firstname} {item.lastname}
						</Text>
					</View>
					{userDoc?.role === "searcher" ? (
						<Text style={styles.itemText}>
							{item.jobtitle} position{"\n"}
							{item.companyname}
						</Text>
					) : (
						<Text style={styles.itemText}>
							Applied as{"\n"}
							{item.jobtitle}
						</Text>
					)}
				</View>
				<View style={styles.itemSide}>
					<Pressable
						onPress={() => {
							Alert.alert(
								"Confirm chat deletion?",
								"",
								[
									{
										text: "Confirm",
										onPress: () => deleteChat(item.chatId),
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
							style={[styles.itemText, { fontWeight: "bold", color: "white" }]}>
							X
						</Text>
					</Pressable>
				</View>
			</Pressable>
		);
	};

	const deleteChat = async (chatId: string) => {
		try {
			setLoading(true);
			if (!userDoc || !userAuth?.uid) {
				console.error("user error is undefined");
				return;
			}

			// Delete chatId in User chatIds
			await updateDoc(doc(db, "users", userAuth.uid), {
				chatIds: arrayRemove(chatId),
			});

			console.log("Deleted chat", chatId);

			// Update the local userDoc context
			setUserDoc({
				...userDoc,
				chatIds: userDoc.chatIds.filter((id: string) => id !== chatId),
			});
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
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
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				{chatList.length === 0 ? (
					<View style={styles.info}>
						<Text style={styles.infoText}>Let's make some connections!</Text>
					</View>
				) : (
					<FlatList
						data={chatList}
						renderItem={renderItem}
						keyExtractor={(item) => item.chatId}
						contentContainerStyle={styles.list}></FlatList>
				)}
			</View>
		</View>
	);
}
