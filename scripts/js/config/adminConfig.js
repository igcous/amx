import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

import { readFile } from "fs/promises";
const readJsonFile = async () => {
	try {
		const data = await readFile(filePath, "utf-8");
		return await JSON.parse(data);
	} catch (error) {
		console.error("Error reading JSON key file:", error);
	}
};

const filePath = "./config/auth1_service_account_key.json";
const key = await readJsonFile(filePath);

export const app = initializeApp({
	credential: cert(key),
});
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
