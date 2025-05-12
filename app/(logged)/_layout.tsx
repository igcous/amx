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
import { ActivityIndicator } from "react-native";
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
					userDoc?.role === "searcher" ? Colors.primary : Colors.secondary,
			}}>
			<Tabs.Screen
				name={userDoc?.role === "searcher" ? "apply" : "post"}
				options={{
					title: userDoc?.role === "searcher" ? "Apply" : "Post",
					headerShown: false,
				}}></Tabs.Screen>
			<Tabs.Screen
				name={userDoc?.role === "searcher" ? "post" : "apply"}
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
