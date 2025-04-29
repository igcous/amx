import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { useState, useLayoutEffect, useCallback } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { db } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { useImage, Image } from "expo-image";

export default function Page() {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const { userAuth, userDoc } = useAuth();
	const { firstname, lastname, companyname, jobtitle, picURL, chatId } =
		useLocalSearchParams<{
			firstname: string;
			lastname: string;
			companyname: string;
			jobtitle: string;
			picURL: string;
			chatId: string;
		}>();

	const profilePic = picURL
		? useImage(picURL)
		: require("../../../assets/profile_icon.svg");

	useLayoutEffect(() => {
		const collectionRef = collection(db, `chats/${chatId}/messages`);
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
		addDoc(collection(db, `chats/${chatId}/messages`), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.topBar}>
					<View style={styles.header}>
						<Image
							contentFit="cover"
							source={profilePic}
							style={styles.profilePic}
						/>
						<Text style={styles.headerText}>
							{firstname} {lastname}
						</Text>
					</View>
					{userDoc?.role === "searcher" ? (
						<Text style={styles.headerText}>
							{jobtitle} position{"\n"}
							{companyname}
						</Text>
					) : (
						<Text style={styles.headerText}>
							Applied as{"\n"}
							{jobtitle}
						</Text>
					)}
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
		marginTop: 10,
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
	topBar: {
		backgroundColor: Colors.tertiary,
		padding: 16,
		marginBottom: 10,
		width: "100%",
		alignSelf: "center",
		justifyContent: "flex-start",
	},
	header: {
		flexDirection: "row",
		gap: 10,
		marginBottom: 5,
	},
	headerText: {
		fontSize: 18,
		verticalAlign: "middle",
	},
	profilePic: {
		width: width * 0.1,
		height: width * 0.1,
		alignSelf: "center",
	},
});
