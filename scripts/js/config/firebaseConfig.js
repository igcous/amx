import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyALqTf5bRlaVP7ZxebxOeXveHDzZYSCDRg",
	authDomain: "auth1-5688a.firebaseapp.com",
	projectId: "auth1-5688a",
	storageBucket: "auth1-5688a.firebasestorage.app",
	messagingSenderId: "275860194222",
	appId: "1:275860194222:web:a10c828c9bee4d5863be3f",
	measurementId: "G-WYKPG6FB8S",
};
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
