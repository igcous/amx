import { auth, db } from "./adminConfig.js";
import { readFile } from "fs/promises";

// Create users from dummy file
export const signUsers = async () => {
	try {
		const data = await readFile("./v2/users.json", "utf-8");
		const users = JSON.parse(data);
		for (const user of users) {
			const newUser = await auth.createUser(user);
			await db.collection("users").doc(newUser.uid).set(user);
		}

		console.log("All test users have been created.");
	} catch (e) {
		console.error("Error reading or parsing users.json:", e);
	}
};

// Create posts and assign randomly

export const createPost = async () => {
	// PSEUDOCODE
	// Go through users
	//      Check recruiter role
	//          Add post [0-3]
	//              Go through users
	//                  Check searcher role
	//                      Apply to post randomly
	//          Swipe applicants randomly
	//              Create chatId
};
