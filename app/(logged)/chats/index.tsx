import {
	StyleSheet,
	Text,
	View,
	ListRenderItem,
	FlatList,
	Pressable,
	Dimensions,
} from "react-native";
import { useImage, Image } from "expo-image";
import { useState, useEffect } from "react";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

type ChatUser = {
	id: string;
	chatId: string;
	postId: string;
	firstname: string;
	lastname: string;
	companyname: string;
	jobtitle: string;
	picURL: string;
};

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc } = useAuth();
	const [chatList, setChatList] = useState<ChatUser[] | null>([]);

	useEffect(() => {
		console.log(userDoc);
		const fetchChatList = async () => {
			if (!userDoc) {
				console.error("userDoc is undefined");
				return;
			}

			if (userDoc.chatIds) {
				const chatUsers: ChatUser[] | null = [];

				for (const chatId of userDoc.chatIds) {
					try {
						// get chat info -> users
						const chatSnap = await getDoc(doc(db, "chats", chatId));

						// assume 1-on-1 chats
						const userToFetch =
							chatSnap.data()?.users[0] === userAuth?.uid
								? chatSnap.data()?.users[1]
								: chatSnap.data()?.users[0];

						// get other user info
						const userDocSnap = await getDoc(doc(db, "users", userToFetch));

						// fetch post info
						const postId = chatSnap.data()?.postId;
						const postSnap = await getDoc(doc(db, "posts", postId));

						const chatUser: ChatUser = {
							id: userToFetch,
							chatId: chatId,
							postId: postId,
							firstname: userDocSnap.data()?.firstname,
							lastname: userDocSnap.data()?.lastname,
							companyname: userDocSnap.data()?.companyname,
							jobtitle: postSnap.data()?.title,
							picURL: userDocSnap.data()?.profilePicURL,
						};

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
	}, [userDoc]);

	const renderItem: ListRenderItem<ChatUser> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					console.log(item.chatId);
					router.navigate({
						pathname: `/chats/${item.chatId}`,
						params: {
							firstname: item.firstname,
							lastname: item.lastname,
							companyname: item.companyname,
							picUrl: item.picURL,
							jobtitle: item.jobtitle,
						},
					});
				}}
				onLongPress={() => {
					// see post page
				}}>
				<View style={styles.itemHeader}>
					{item.picURL ? (
						<Image
							contentFit="cover"
							source={{ uri: item.picURL }}
							style={styles.profilePic}
						/>
					) : (
						// No image fallback
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
			</Pressable>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<FlatList
					data={chatList}
					renderItem={renderItem}
					keyExtractor={(item) => item.chatId}
					contentContainerStyle={styles.list}></FlatList>
			</View>
		</View>
	);
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
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

	// This part of the styleSheet is specific to this page
	list: {
		flexGrow: 1,
		width: "90%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	item: {
		backgroundColor: Colors.tertiary,
		padding: 16,
		borderWidth: 1,
		borderRadius: 20,
		marginBottom: 10,
	},
	itemHeader: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		gap: 10,
		marginBottom: 5,
	},
	itemText: {
		fontSize: 18,
		verticalAlign: "middle",
	},
	profilePic: {
		width: width * 0.1,
		height: width * 0.1,
		alignSelf: "center",
	},
});
