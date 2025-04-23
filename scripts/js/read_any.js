import { doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebaseConfig.js";
import { writeFile } from "fs/promises";

const collectionName = "chats";
const docName = "YQHJPfdOFq7R5Qz3rPMb";

const docSnap = await getDoc(doc(db, colllectionName, docName));
const data = docSnap.data();

// save to file
// note: this is useful to check the JSON structure of data, like the messages from GiftedChat

try {
	await writeFile("./data.json", JSON.stringify(data), "utf-8");
	console.log("Data has been written to data.json");
} catch (error) {
	console.error("Error writing to file:", error);
}

console.log(data);
