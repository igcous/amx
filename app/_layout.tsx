/*
Title: Root app layout

Description:
	This layout file is used to expose the AuthProvider (defined in /context/AuthContext.tsx to all)
	Following the structure in https://docs.expo.dev/router/advanced/authentication/
	Its also a mix between that and the React Docs on how to use Context

TODO:
	Define Colors in a Context instead of /constants and then use this context for light and dark color themes
*/

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
	FirebaseMessagingTypes,
	getMessaging,
	onMessage,
} from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

export default function RootLayout() {
	const messaging = getMessaging();

	// Request notifications permissions
	const checkAndRequestPermission = async () => {
		if (Platform.OS === "android") {
			const granted = await PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
			);
			if (!granted) {
				await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
				);
			}
		}
	};
	checkAndRequestPermission();

	useEffect(() => {
		const unsubscribe = onMessage(
			messaging,
			async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
				console.log("Message: ", remoteMessage);
				console.log("Received!");

				// notifee handling
				// Create a channel (required for Android)
				const channelId = await notifee.createChannel({
					id: "default",
					name: "Default Channel",
				});

				await notifee.displayNotification({
					title: "New Message",
					body: "Body",
					android: {
						channelId: "default",
					},
				});
			}
		);
		return unsubscribe;
	}, []);

	return (
		<AuthProvider>
			<SafeAreaProvider>
				<Stack screenOptions={{ headerShown: false }} />
			</SafeAreaProvider>
		</AuthProvider>
	);
}
