/*
Title: Layout for logged users

Description:
	Handles the redirection based on auth state
	This is what redirect the user to landing page when they log out
	This layout file defines the App structure for logged users
		If Searcher, tabs are Apply, Profile, Chats
		If Recruiter, tabs are Post, Profile, Chats
*/

import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, Alert } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useRouter } from "expo-router";
import {
	getMessaging,
	setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { useEffect } from "react";

export default function LoggedLayout() {
	const { userAuth, userDoc, setUserDoc, loading } = useAuth();
	const router = useRouter();

	// Notifications listener
	const messaging = getMessaging();
	useEffect(() => {
		const unsubscribe = setBackgroundMessageHandler(
			messaging,
			async (remoteMessage) => {
				Alert.alert("A new notification!", JSON.stringify(remoteMessage));
			}
		);

		return unsubscribe;
	}, []);

	return !userAuth ? (
		<Redirect href="/(not-logged)"></Redirect>
	) : !userDoc ? (
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
		<Tabs
			screenOptions={{
				tabBarStyle: {
					height: 70,
				},
				tabBarLabelStyle: {
					fontSize: 20,
				},
				tabBarActiveTintColor:
					userDoc.role === "searcher" ? Colors.primary : Colors.secondary,
				lazy: true,
			}}
			/* 
			Usage cases (i.e. why is screenListeners here?):
				When redirecting to a specific chat, chats/index is never pushed onto the stack
					Back button does not work
				Must have a way to go to chats/index regardless
				*/
			screenListeners={{
				tabPress: (e) => {
					const result = e.target?.split("-")[0];
					if (result === "apply") {
						router.replace("/apply");
					} else if (result === "post") {
						router.replace("/post");
					} else if (result === "profile") {
						router.replace("/profile");
					} else if (result === "chats") {
						router.replace("/chats");
					}
				},
			}}>
			<Tabs.Screen
				name={userDoc.role === "searcher" ? "apply" : "post"}
				options={{
					title: userDoc?.role === "searcher" ? "Apply" : "Post",
					headerShown: false,
				}}></Tabs.Screen>
			<Tabs.Screen
				name={userDoc.role === "searcher" ? "post" : "apply"}
				options={{ href: null }}></Tabs.Screen>
			<Tabs.Screen
				name="profile"
				options={{ title: "Profile", headerShown: false }}></Tabs.Screen>
			<Tabs.Screen
				name="chats"
				options={{ title: "Chats", headerShown: false }}></Tabs.Screen>
		</Tabs>
	);
}
