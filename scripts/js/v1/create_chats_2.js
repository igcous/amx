import { auth } from "../config/adminConfig.js";
import { readFile } from "fs/promises";
import {
	doc,
	setDoc,
	addDoc,
	getDoc,
	updateDoc,
	collection,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

export const addAllChats = async () => {
	const dummyUsers = await readFile("./dummy/users.json", "utf-8");
	const users = JSON.parse(dummyUsers);
	const allUsers = [];

	const dummyMessages = await readFile("./dummy/messages.json", "utf-8");
	const messages = JSON.parse(dummyMessages);

	for (const user of users) {
		try {
			const record = await auth.getUserByEmail(user.email);
			allUsers.push(record.uid);
			// minimize the number of times getUserByEmail is used
			console.log(record.uid);
		} catch (e) {
			console.log("Error, probabaly user not found");
		}
	}
	for (let i = 0; i < allUsers.length; i++) {
		for (let j = i + 1; j < allUsers.length; j++) {
			console.log(i);
			console.log(j);

			let userId1 = allUsers[i];
			let userId2 = allUsers[j];
			//if (userId1 !== userId2) {
			const docRef = await addDoc(collection(db, "chats"), {
				users: [userId1, userId2].sort(),
			});

			// Add messages as a sub-collection under the chat document
			// Forget about this for now, there is some problem with Firebase Timestamp and Date
			// Possible solution: use the Timestamp constructor with seconds and nanoseconds (look in messages.json)
			/*for (const message of messages) {
				await addDoc(collection(docRef, "messages"), message);
			}*/
			const newChatId = docRef.id;

			// update user 1
			const docSnap1 = await getDoc(doc(db, "users", userId1));
			const data1 = docSnap1.data();
			updateDoc(doc(db, "users", userId1), {
				chatIds:
					"chatIds" in data1 ? [newChatId, ...data1.chatIds] : [newChatId],
			});

			// update user 2
			const docSnap2 = await getDoc(doc(db, "users", userId2));
			const data2 = docSnap2.data();
			updateDoc(doc(db, "users", userId2), {
				chatIds:
					"chatIds" in data2 ? [newChatId, ...data2.chatIds] : [newChatId],
			});

			console.log(newChatId);
			//}
		}
	}
};

// TODO
export const addChatToUser = async (email, password) => {};
