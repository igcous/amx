import { Stack, Redirect, Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoggedLayout() {
	const { userAuth, userDoc } = useAuth();

	return userAuth === null ? (
		<Redirect href="/(not-logged)"></Redirect>
	) : (
		<Tabs>
			{userDoc?.role === "searcher" ? (
				<Tabs.Screen name="apply" options={{ title: "Apply" }}></Tabs.Screen>
			) : (
				<Tabs.Screen name="apply" options={{ href: null }}></Tabs.Screen>
			)}
			{userDoc?.role === "recruiter" ? (
				<Tabs.Screen name="postlist" options={{ title: "Post" }}></Tabs.Screen>
			) : (
				<Tabs.Screen name="postlist" options={{ href: null }}></Tabs.Screen>
			)}
			<Tabs.Screen name="profile" options={{ title: "Profile" }}></Tabs.Screen>
			<Tabs.Screen name="chatlist" options={{ title: "Chats" }}></Tabs.Screen>
			<Tabs.Screen name="post/[postId]" options={{ href: null }}></Tabs.Screen>
			<Tabs.Screen name="chat/[chatId]" options={{ href: null }}></Tabs.Screen>
			<Tabs.Screen name="editskills" options={{ href: null }}></Tabs.Screen>
			<Tabs.Screen name="oldchat" options={{ href: null }}></Tabs.Screen>
		</Tabs>
	);
}
