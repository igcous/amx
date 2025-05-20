/*
Title: Root app layout

Description:
	This layout file is used to expose the AuthProvider (defined in /context/AuthContext.tsx to all)
	Following the structure in https://docs.expo.dev/router/advanced/authentication/
	Its also a mix between that and the React Docs on how to use Context

TODO:
	Define Colors in a Context instead of /constants and then use this context for light and dark color themes
*/

import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
	FirebaseMessagingTypes,
	getInitialNotification,
	getMessaging,
	onMessage,
	onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
	const messaging = getMessaging();
	const router = useRouter();

	useEffect(() => {
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

			const status = await PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
			);
			console.log("Notification permissions:", status);
		};
		checkAndRequestPermission();
	}, []);

	useEffect(() => {
		// Handle when app is opened from quit state (cold start)
		// Works but its erratic
		getInitialNotification(messaging).then((remoteMessage) => {
			console.log(remoteMessage?.data?.chatId);
			if (remoteMessage?.data?.chatId) {
				router.push(`/chats/`);
			}
		});
	}, [router]);

	/*
	useEffect(() => {
		const checkPendingNavigation = async () => {
			const chatId = await AsyncStorage.getItem("pendingRouting");
			console.log("Pending Routing", chatId);
			if (chatId) {
				//router.push(`/chats/${chatId}`);
				await AsyncStorage.removeItem("pendingRouting");
				console.log("Router triggered");
				router.push("/chats");
			}
		};
		console.log("been here");
		checkPendingNavigation();
	}, []);
	*/

	useEffect(() => {
		// Handles FCM messages when the application is alive/in the foreground
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
					title: remoteMessage.notification
						? remoteMessage.notification.title
						: "New notification",
					body: remoteMessage.notification
						? remoteMessage.notification.body
						: "Notification text goes here",
					data: remoteMessage.data,
					android: {
						channelId: "default",
					},
				});
			}
		);
		return unsubscribe;
	}, []);

	/*
	useEffect(() => {
		// This runs when the app is opened from a notification (background state)
		const unsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
			router.push("/chats/");
		});

		// This runs when the app is launched from a quit state via a notification

		getInitialNotification(messaging).then((remoteMessage) => {
			if (remoteMessage?.data?.chatId) {
				router.push(`/chats/${remoteMessage.data.chatId}`);
			}
		});

		return unsubscribe;
	}, []);
	*/

	useEffect(() => {
		const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
			if (type === EventType.PRESS) {
				// Handle notification press
				console.log("Notification pressed!", detail);
				const chatId = detail.notification?.data?.chatId as string;
				// TODO: go to chat Id
				console.log("Chat Id:", chatId);
				//router.push(`/chats/${chatId}`);
				router.push(`/chats/`);
			}
		});
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
