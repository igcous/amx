import { auth, db } from "./config/firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { readFile } from "fs/promises";

const signup = async (dummy) => {
	try {
		const password = "123456";

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			dummy.email,
			password
		);
		const { password: _a, ...noPassDummy } = dummy;
		console.log("Added user: ", noPassDummy);
		await setDoc(doc(db, "users", userCredential.user.uid), {
			...noPassDummy,
		});
	} catch (e) {
		console.log(e);
	}
};

export const signUsers = async () => {
	try {
		const data = await readFile("./dummy/users.json", "utf-8");
		const users = JSON.parse(data);
		for (const user of users) {
			await signup(user); // Wait for each signup to complete
		}
	} catch (e) {
		console.error("Error reading or parsing users.json:", e);
	}
};
