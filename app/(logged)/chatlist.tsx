import {
	StyleSheet,
	Text,
	ScrollView,
	View,
	ListRenderItem,
	FlatList,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

type ChatUser = {
	id: string;
	firstname: string;
	lastname: string;
	companyname: string;
	chatId: string;
	// job post id or something like that may go here in the future
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
						const docSnap = await getDoc(doc(db, "chats", chatId));
						const chatData = docSnap.data();

						// assume 1-on-1 chats
						const userToFetch =
							chatData!.users[0] === userAuth?.uid
								? chatData!.users[1]
								: chatData!.users[0];

						// get other user info
						const userDocSnap = await getDoc(doc(db, "users", userToFetch));
						const userData = userDocSnap.data();

						const chatUser: ChatUser = {
							id: userToFetch,
							firstname: userData!.firstname,
							lastname: userData!.lastname,
							companyname: userData!.companyname,
							chatId: chatId,
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
				onPress={() => {
					console.log(item.chatId);
					router.navigate({
						pathname: `/chat/${item.chatId}`,
					});
				}}>
				<Text>{item.firstname}</Text>
			</Pressable>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={chatList}
				renderItem={renderItem}
				contentContainerStyle={{ flexGrow: 1 }}></FlatList>
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
