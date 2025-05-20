/*
	// PSEUDOCODE FOR CREATE POSTS
	// Go through users
	//      Check recruiter role
	//          Add post [0-3]
	//              Go through users
	//                  Check searcher role
	//                      Apply to post randomly
	//          	Swipe applicants randomly
	//              	Create chatId

*/

import { auth, db } from "./adminConfig.js";
import { readFile } from "fs/promises";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { jobposts } from "./constants.js";

// Create users from dummy file
export const signUsers = async () => {
	try {
		const data = await readFile("./v2/testUsers.json", "utf-8");
		const users = JSON.parse(data);
		for (const user of users) {
			const newUser = await auth.createUser({ ...user, password: "123456" });
			await db.collection("users").doc(newUser.uid).set(user);
		}

		console.log("All test users have been created.");
	} catch (e) {
		console.error("Error reading or parsing users.json:", e);
	}
};

// Create posts and assign randomly
export const createPosts = async () => {
	const rPostsNumber = () => Math.floor(Math.random() * 5);
	const rBool = () => Math.floor(Math.random() < 0.5);
	const rPost = () => Math.floor(Math.random() * jobposts.length);

	try {
		// Get all users
		const snapshot = await db.collection("users").get();
		const users = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		console.log(users);
		console.log("Total number of users:", users.length);

		for (const recruiter of users) {
			if (recruiter.role === "recruiter") {
				console.log("Recruiter:", recruiter.id);

				//const n = rPostsNumber();
				const n = 3;
				console.log("Adding " + n + " posts");
				for (let i = 0; i < n; i++) {
					const r = rPost();

					// Choose random post
					const post = {
						title: jobposts[r].title,
						text: jobposts[r].text,
						jobSkills: jobposts[r].jobSkills,
						employer: jobposts[r].employer,
						postedBy: recruiter.id,
						postedAt: Timestamp.now(),
					};
					console.log("New Post Data: ", post);

					// Create post in db, get its id
					const postRef = await db.collection("posts").add(post);
					const postId = postRef.id;
					console.log("Created post, id: ", postId);

					// Add to recruiter publishedPosts
					await db
						.collection("users")
						.doc(recruiter.id)
						.update({
							publishedPosts: FieldValue.arrayUnion(postId),
						});

					// Add applicants randomly
					for (const searcher of users) {
						if (searcher.role === "searcher") {
							console.log("Applicant:", searcher.id);
							// Seen or not
							if (true) {
								// Apply or not
								if (true) {
									await db
										.collection("users")
										.doc(searcher.id)
										.update({
											seenPosts: FieldValue.arrayUnion(postId),
											likedPosts: FieldValue.arrayUnion(postId),
										});
									await db
										.collection("posts")
										.doc(postId)
										.update({
											applicants: FieldValue.arrayUnion(searcher.id),
										});
								} else {
									await db
										.collection("users")
										.doc(searcher.id)
										.update({
											seenPosts: FieldValue.arrayUnion(postId),
										});
								}
							}
						}
					}

					// Get post again
					const postSnap = await db.collection("posts").doc(postId).get();
					console.log("Post after applications:", postSnap.data());

					// Swipe randomly on applicants
					const applicants = postSnap.data().applicants;

					if (applicants) {
						for (const applicantId of applicants) {
							// Seen or not
							if (false) {
								await db
									.collection("posts")
									.doc(postId)
									.update({
										seenApplicants: FieldValue.arrayUnion(applicantId),
									});

								// Liked or not
								if (rBool()) {
									await db
										.collection("posts")
										.doc(postId)
										.update({
											likedApplicants: FieldValue.arrayUnion(applicantId),
										});

									// Create chat
									const chat = {
										users: [recruiter.id, applicantId].sort(),
										postId: postId,
									};

									const chatRef = await db.collection("chats").add(chat);
									const chatId = chatRef.id;

									await db
										.collection("users")
										.doc(recruiter.id)
										.update({
											chatIds: FieldValue.arrayUnion(chatId),
										});
									await db
										.collection("users")
										.doc(applicantId)
										.update({
											chatIds: FieldValue.arrayUnion(chatId),
										});
									console.log("Added chat Id:", chatId);
								}
							}
						}
					}
				}
			}
		}
	} catch (e) {
		console.error("Error creating posts:", e);
	}
};
