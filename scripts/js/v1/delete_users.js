import { auth } from "../config/adminConfig.js";
import { readFile } from "fs/promises";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

export const deleteUsers = async () => {
	try {
		const data = await readFile("./dummy/users.json", "utf-8");
		const users = JSON.parse(data);
		for (const user of users) {
			try {
				const record = await auth.getUserByEmail(user.email);
				await auth.deleteUser(record.uid);

				// also delete the Firestore entry
				await deleteDoc(doc(db, "users", record.uid));

				console.log("Deleted user: ", record.uid);
			} catch (e) {
				console.log("Error deleting Auth user (probabaly user not found)");
			}
		}
	} catch (e) {
		console.error("Error reading or parsing users.json:", e);
	}
};
