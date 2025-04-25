/*
Title: Layout for logged users

Description:
	Handles the redirection based on auth state
	This is what redirect the user to landing page when they log out
	This layout file defines the App structure for logged users
		If Searcher, tabs are Apply, Profile, Chats
		If Recruiter, tabs are Post, Profile, Chats
*/

import { Stack, Redirect, Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoggedLayout() {
	const { userAuth, userDoc, loading } = useAuth();

	return userAuth === null ? (
		<Redirect href="/(not-logged)"></Redirect>
	) : loading ? (
		<></>
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
