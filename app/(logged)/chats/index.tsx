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
import { useState } from "react";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { ChatType } from "../../../constants/dataTypes";
import styles from "./style";

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc, chatList, loading: loadingAuth } = useAuth();
	const [loading, setLoading] = useState<boolean>(false); // Local

	const renderItem: ListRenderItem<ChatType> = ({ item }) => {
		return (
			<Pressable
				style={styles.item}
				onPress={() => {
					//console.log(item.chatId);
					router.push({
						pathname: `/chats/${item.id}`,
						params: {},
					});
				}}>
				<View style={styles.itemBody}>
					<View style={styles.itemHeader}>
						{item.user.picURL ? (
							<Image
								contentFit="cover"
								source={{ uri: item.user.picURL }}
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
							{item.user.firstname} {item.user.lastname}
						</Text>
					</View>
					{userDoc?.role === "searcher" ? (
						<Text style={styles.itemText}>
							{item.post.title}
							{"\n"}
							{item.post.employer}
						</Text>
					) : (
						<Text style={styles.itemText}>
							Applied as{"\n"}
							{item.post.title}
						</Text>
					)}
				</View>

				<Pressable
					style={styles.itemSide}
					onPress={() => {
						Alert.alert(
							"Confirm chat deletion?",
							"",
							[
								{
									text: "Confirm",
									onPress: () => deleteChat(item.id),
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
						style={[styles.itemText, { fontWeight: "bold", color: "black" }]}>
						X
					</Text>
				</Pressable>
			</Pressable>
		);
	};

	const deleteChat = async (chatId: string) => {
		try {
			setLoading(true);
			if (!userDoc || !userAuth?.uid) {
				throw Error("User or Auth is undefined");
			}

			// Delete chatId in User chatIds
			await updateDoc(doc(db, "users", userAuth.uid), {
				chatIds: arrayRemove(chatId),
			});
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return !chatList || loading || loadingAuth ? (
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
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.list}></FlatList>
				)}
			</View>
		</View>
	);
}
