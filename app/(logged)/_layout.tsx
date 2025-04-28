/*
Title: Layout for logged users

Description:
	Handles the redirection based on auth state
	This is what redirect the user to landing page when they log out
	This layout file defines the App structure for logged users
		If Searcher, tabs are Apply, Profile, Chats
		If Recruiter, tabs are Post, Profile, Chats
*/

import { Stack, Redirect, Tabs, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, BackHandler } from "react-native";
import { Colors } from "../../constants/colorPalette";

export default function LoggedLayout() {
	const { userAuth, userDoc, loading } = useAuth();

	/* keep this just in case, works
	// Custom back button behavior
	useFocusEffect(() => {
		const onBackPress = () => {
			// Customize behavior here
			if (userDoc?.role === "searcher") {
				// Example: Prevent going back to "apply" tab
				return true; // Returning true disables the back button
			}
			return false; // Default behavior
		};

		BackHandler.addEventListener("hardwareBackPress", onBackPress);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", onBackPress);
	});
	*/

	return userAuth === null ? (
		<Redirect href="/(not-logged)"></Redirect>
	) : loading ? (
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
	) : userDoc?.role === "searcher" ? (
		<Tabs>
			<Tabs.Screen name="apply" options={{ title: "Apply" }}></Tabs.Screen>
			<Tabs.Screen name="profile" options={{ title: "Profile" }}></Tabs.Screen>
			<Tabs.Screen name="chats" options={{ title: "Chats" }}></Tabs.Screen>
			<Tabs.Screen name="post" options={{ href: null }}></Tabs.Screen>
		</Tabs>
	) : (
		<Tabs>
			<Tabs.Screen name="post" options={{ title: "Post" }}></Tabs.Screen>
			<Tabs.Screen name="profile" options={{ title: "Profile" }}></Tabs.Screen>
			<Tabs.Screen name="chats" options={{ title: "Chats" }}></Tabs.Screen>
			<Tabs.Screen name="apply" options={{ href: null }}></Tabs.Screen>
		</Tabs>
	);
}
