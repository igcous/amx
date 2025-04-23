import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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
