/*
Title: Layout for not-logged Users

Description:
	Handles the redirection based on auth state
	e.g. this is what redirect the users to (logged) when they click "Create Account" at the end (auth state change)
*/

import { Stack, Redirect, Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function NotLoggedLayout() {
	const { userAuth } = useAuth();

	return userAuth ? (
		<Redirect href="/(logged)/profile/"></Redirect>
	) : (
		<Stack screenOptions={{ headerShown: false }} />
	);
}
