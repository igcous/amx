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
import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function RootLayout() {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
		[]
	);
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.EventSubscription>();
	const responseListener = useRef<Notifications.EventSubscription>();

	useEffect(() => {
		//registerForPushNotificationsAsync().then((token) => token && setExpoPushToken(token));
		registerForPushNotificationsAsync(); // Dont need token for local notification

		if (Platform.OS === "android") {
			Notifications.getNotificationChannelsAsync().then((value) =>
				setChannels(value ?? [])
			);
		}
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current
				);
			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	// TODO: use to schedule a notification a day or something like that
	//schedulePushNotification(); // runs twice, react development mode?

	return (
		<AuthProvider>
			<SafeAreaProvider>
				<Stack screenOptions={{ headerShown: false }} />
			</SafeAreaProvider>
		</AuthProvider>
	);
}

async function schedulePushNotification() {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "You've got mail! 📬",
			body: "Here is the notification body",
			data: { data: "goes here", test: { test1: "more data" } },
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: 2,
		},
	});
}

async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("myNotificationChannel", {
			name: "A channel is needed for the permissions prompt to appear",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			//alert("Failed to get push token for push notification!");
			return;
		}
		// Learn more about projectId:
		// https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
		// EAS projectId is used here.
		/*
		try {
			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;
			if (!projectId) {
				throw new Error("Project ID not found");
			}
			
			token = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(token);
		} catch (e) {
			token = `${e}`;
			console.log(token);
		}
		*/
	} else {
		alert("Must use physical device for Push Notifications");
	}

	return token;
}
