/*
Title: Root App Layout

Description:
	This layout file is used to expose the AuthProvider (defined in /context/AuthContext.tsx to all)
	Following the structure in https://docs.expo.dev/router/advanced/authentication/
	Its also a mix between that and the React Docs on how to use Context

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
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
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
			//console.log("Notification permissions:", status);
		};
		checkAndRequestPermission();
	}, []);

	useEffect(() => {
		// Handle when app is opened from killed state (cold start)
		getInitialNotification(messaging).then(async (remoteMessage) => {
			const chatId = remoteMessage?.data?.chatId as string;
			console.log("Opened app from killed state, with arg: ", chatId);
			if (chatId) {
				await AsyncStorage.setItem("pendingChatId", chatId);
			}
		});
	}, []);

	useEffect(() => {
		// Handles FCM messages when the application is alive/in the foreground
		const unsubscribe = onMessage(
			messaging,
			async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
				console.log("Message: ", remoteMessage);
				console.log("Received!");

				// Notifee handling
				// Create a channel (required for Android)
				const channelId = await notifee.createChannel({
					id: "default",
					name: "Default Channel",
					importance: AndroidImportance.HIGH,
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

	useEffect(() => {
		const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
			if (type === EventType.PRESS) {
				// Handle notification press
				console.log("Notification pressed!", detail);
				const chatId = detail.notification?.data?.chatId as string;
				router.push(`/chats/${chatId}`);
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
