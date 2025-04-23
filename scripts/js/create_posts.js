import { auth, db } from "./config/firebaseConfig.js";
import { readFile } from "fs/promises";
import {
	doc,
	getDocs,
	setDoc,
	updateDoc,
	addDoc,
	collection,
	getDoc,
	Timestamp,
	deleteDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as admin } from "./config/adminConfig.js";

const login = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential;
	} catch (e) {
		console.log(e);
	}
};

export const addPostsAs = async (email, password) => {
	//console.log("Logging as: ", email);
	const userCredential = await login(email, password);
	//console.log(userCredential);
	const userId = userCredential.user.uid;
	console.log("Logging as: ", userId);

	try {
		// delete all posts first
		const querySnapshot = await getDocs(collection(db, "posts"));
		for (const docSnap of querySnapshot.docs) {
			await deleteDoc(doc(db, "posts", docSnap.id));
		}
		console.log("All posts deleted.");

		const data = await readFile("./dummy/posts.json", "utf-8");
		const posts = JSON.parse(data);
		for (const post of posts) {
			post.postedBy = userId;
			post.postedAt = Timestamp.now();
			await addDoc(collection(db, "posts"), post);
		}
	} catch (e) {
		console.error("Error reading or parsing posts.json:", e);
	}
};

export const addSeenPostToUser = async (email, password, postId) => {
	try {
		const record = await admin.getUserByEmail(email);
		const userCredential = await login(email, password);
		const userId = userCredential.user.uid;

		const docSnap = await getDoc(doc(db, "users", userId));
		const data = docSnap.data();

		"seenPosts" in data
			? await updateDoc(doc(db, "users", userId), {
					seenPosts: [...data.seenPosts, postId],
			  })
			: await updateDoc(doc(db, "users", userId), {
					seenPosts: [postId],
			  });
	} catch (e) {
		console.log(e);
	}
};

export const addLikedPostToUser = async (email, password, postId) => {
	try {
		const record = await admin.getUserByEmail(email);
		const userCredential = await login(email, password);
		const userId = userCredential.user.uid;

		const docSnap = await getDoc(doc(db, "users", userId));
		const data = docSnap.data();

		"likedPosts" in data
			? await updateDoc(doc(db, "users", userId), {
					likedPosts: [...data.likedPosts, postId],
			  })
			: await updateDoc(doc(db, "users", userId), {
					likedPosts: [postId],
			  });
	} catch (e) {
		console.log(e);
	}
};

export const concatToUserField = async (fieldName, value, email, password) => {
	try {
		const record = await admin.getUserByEmail(email);
		const userCredential = await login(email, password);
		const userId = userCredential.user.uid;

		const docSnap = await getDoc(doc(db, "users", userId));
		const data = docSnap.data();

		"likedPosts" in data
			? await updateDoc(doc(db, "users", userId), {
					[fieldName]: [...data.fieldName, value],
			  })
			: await updateDoc(doc(db, "users", userId), {
					[fieldName]: [value],
			  });
	} catch (e) {
		console.log(e);
	}
};

export const getAllPosts = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "posts"));
		return querySnapshot.docs;
	} catch (e) {
		console.log(e);
	}
};
