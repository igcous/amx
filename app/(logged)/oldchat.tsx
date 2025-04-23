import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colorPalette";
import { AntDesign } from "@expo/vector-icons";
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
	const router = useRouter();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const { userAuth } = useAuth();

	useLayoutEffect(() => {
		const collectionRef = collection(db, "chats");
		const q = query(collectionRef, orderBy("createdAt", "desc"));

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
		addDoc(collection(db, "chats"), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	return (
		<GiftedChat
			messages={messages}
			onSend={(messages) => handleSend(messages)}
			user={{ _id: userAuth!.uid }}
		/>
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
