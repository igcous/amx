import { registerRootComponent } from "expo";

import App from "./App";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Handles FCM messages when the app is in a killed state

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	//console.log("Message: ", remoteMessage);

	/*
	// Create a channel (required for Android)
	const channelId = await notifee.createChannel({
		id: "default",
		name: "Default Channel",
	});
	*/

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
});

/*
notifee.onBackgroundEvent(async ({ type, detail }) => {
	if (type === EventType.PRESS) {
		const chatId = detail.notification?.data?.chatId as string;
		//console.log("Chat Id:", chatId); // printing does not work and shows a warning
		if (chatId) {
			await AsyncStorage.setItem("pendingRouting", chatId);
		}
	}
});
*/

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
