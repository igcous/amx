import { FieldValue } from "firebase-admin/firestore";
import { auth, db, messaging } from "../config/adminConfig.js";

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

// Just to tell triggering the function in Cloud Functions
const createChat = async () => {
	const user1 = await auth.getUserByEmail("test0@mail.com");
	const user2 = await auth.getUserByEmail("test2@mail.com");

	const chat = {
		users: [user2.uid, user1.uid], // Put recruiter always first
		postId: "CMqdm31tPa4lH2wZCb2S", // If not set, does not display on chats page
	};

	const chatRef = await db.collection("chats").add(chat);
	console.log("New chat added", chatRef.id);

	await db
		.collection("users")
		.doc(user1.uid)
		.update({
			chatIds: FieldValue.arrayUnion(chatRef.id),
		});

	await db
		.collection("users")
		.doc(user2.uid)
		.update({
			chatIds: FieldValue.arrayUnion(chatRef.id),
		});
};

//sendForegroundMessage(); // works for both foreground and background
createChat();
