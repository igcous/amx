import { auth, db } from "./adminConfig.js";

const deleteAuth = async () => {
	try {
		let nextPageToken = undefined;

		do {
			// List users with pagination
			const result = await auth.listUsers(1000, nextPageToken);

			// Delete each user in the current page
			const deletePromises = result.users.map((user) => {
				auth.deleteUser(user.uid);
				console.log("Deleted ", user.id);
			});
			await Promise.all(deletePromises);

			console.log(`Deleted ${result.users.length} users.`);

			// Update the nextPageToken to fetch the next batch
			nextPageToken = result.pageToken;
		} while (nextPageToken);

		console.log("All users have been deleted.");
	} catch (e) {
		console.error("Error deleting users:", e);
	}
};

const deleteCollection = async (collectionPath) => {
	const collectionRef = db.collection(collectionPath);
	const snapshot = await collectionRef.get();

	// Delete all documents in the collection
	const deletePromises = snapshot.docs.map(async (doc) => {
		// Recursively delete subcollections
		const subcollections = await doc.ref.listCollections();
		for (const subcollection of subcollections) {
			await deleteCollection(`${collectionPath}/${doc.id}/${subcollection.id}`);
		}

		// Delete the document itself
		await doc.ref.delete();
		console.log(`Deleted document: ${doc.id}`);
	});

	await Promise.all(deletePromises);
	console.log(`Deleted all documents in collection: ${collectionPath}`);
};

const deleteFirestore = async () => {
	try {
		// List all top-level collections
		const collections = await db.listCollections();

		// Delete each collection and its subcollections
		for (const collection of collections) {
			await deleteCollection(collection.id);
		}

		console.log("Firestore database has been wiped.");
	} catch (e) {
		console.error("Error wiping Firestore database:", e);
	}
};

export const swipe = async () => {
	await deleteAuth();
	await deleteFirestore();
};
