import { auth, db, messaging } from "./adminConfig.js";

const sendForegroundMessage = async () => {
	const user = await auth.getUserByEmail("test0@mail.com");
	console.log(user.uid);
	const ref = await db.collection("users").doc(user.uid).get();
	const token = ref.data().token;
	console.log("FCM Token:", ref.data().token);

	const notification = {
		title: "Foreground notification",
		body: "Sent from Admin SDK",
	};

	const message = {
		token: token,
		notification: notification,
	};

	const result = await messaging.sendEach([message]);
	console.log(result);
	console.log("Sent!");
};

const sendBackgroundMessage = async () => {
	const user = await auth.getUserByEmail("test0@mail.com");
	console.log(user.uid);
	const ref = await db.collection("users").doc(user.uid).get();
	const token = ref.data().token;
	console.log("FCM Token:", ref.data().token);

	const message = {
		token: token,
		data: {
			title: "Background notification",
			body: "Sent from Admin SDK",
		},
	};

	const result = await messaging.sendEach([message]);
	console.log(result);
	console.log("Sent!");
};

const sendNotifeeMessage = async () => {
	const user = await auth.getUserByEmail("test0@mail.com");
	console.log(user.uid);
	const ref = await db.collection("users").doc(user.uid).get();
	const token = ref.data().token;
	console.log("FCM Token:", ref.data().token);

	const message = {
		token: token,
		data: {
			notifee: JSON.stringify({
				body: "This message was sent via FCM!",
				android: {
					channelId: "default",
					actions: [
						{
							title: "Mark as Read",
							pressAction: {
								id: "read",
							},
						},
					],
				},
			}),
		},
	};

	const result = await messaging.sendEach([message]);
	console.log(result);
	console.log("Sent!");
};

sendForegroundMessage(); // works for both foreground and background
