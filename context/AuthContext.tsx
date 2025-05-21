/*
Title: Auth context Provider

Description:
	This context handles the user Authenthication
	It subscribes to the auth state changes and fetches the corresponding user document from Firestore

*/

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from "react";
import { auth, db } from "../config/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import {
	doc,
	DocumentData,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { UserType, ChatType, PostType } from "../constants/dataTypes";

// Notifications
import { getMessaging, getToken } from "@react-native-firebase/messaging";

type AuthContextType = {
	userAuth: User | null;
	setUserAuth: React.Dispatch<React.SetStateAction<User | null>>;
	userDoc: DocumentData | null;
	setUserDoc: React.Dispatch<React.SetStateAction<DocumentData | null>>;
	chatList: ChatType[];
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [userAuth, setUserAuth] = useState<User | null>(null);
	const [userDoc, setUserDoc] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [chatList, setChatList] = useState<ChatType[]>([]);
	const messaging = getMessaging();

	// This useEffect handles userAuth
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setLoading(true);
			setUserAuth(currentUser);
			console.log("User state changed:", currentUser?.uid);
			setLoading(false);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// This useEffect handles userDoc
	useEffect(() => {
		setLoading(true);
		let unsubscribe: (() => void) | undefined;

		if (userAuth) {
			// Set up Firestore listener for the user's document
			unsubscribe = onSnapshot(
				doc(db, "users", userAuth.uid),
				async (docSnap) => {
					if (docSnap.exists()) {
						// Check token and set if necessary
						const token = await getToken(messaging);
						//console.log("FCM Token:", token);
						console.log("User doc updated:", docSnap.data());
						if (!token || token !== docSnap.data().token) {
							setUserDoc((prevUserDoc) => ({
								...prevUserDoc,
								token: token,
							}));
							await updateDoc(doc(db, "users", userAuth.uid), {
								token: token,
							});
						} else {
							setUserDoc(docSnap.data());
						}
					} else {
						// Should never get here, there is always a doc for every user
						console.error("User document does not exist");
					}
				},
				(error) => {
					console.error("Error listening to user document:", error);
				}
			);
		} else {
			// If no user is authenticated, clear the userDoc
			setUserDoc(null);
		}
		setLoading(false);

		// Cleanup Firestore listener when the component unmounts or userAuth changes
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [userAuth]);

	const fetchChatList = async () => {
		if (!userDoc) {
			console.error("userDoc is undefined");
			return;
		}

		if (userDoc.chatIds) {
			const chats: ChatType[] = [];

			for (const chatId of userDoc.chatIds) {
				try {
					const chatSnap = await getDoc(doc(db, "chats", chatId));
					if (!chatSnap.exists()) {
						// ignore
						continue;
					}

					// Get other user info, assuming 1-on-1 chats
					const userToFetch =
						chatSnap.data()?.users[0] === userAuth?.uid
							? chatSnap.data()?.users[1]
							: chatSnap.data()?.users[0];
					const userDocSnap = await getDoc(doc(db, "users", userToFetch));
					if (!userDocSnap.exists()) {
						// ignore
						continue;
					}

					// Get post info
					const postId = chatSnap.data().postId;
					const postSnap = await getDoc(doc(db, "posts", postId));

					if (!postSnap.exists()) {
						// ignore
						continue;
					}

					const chat: ChatType = {
						id: chatId,
						user: {
							id: userToFetch,
							firstname: userDocSnap.data().firstname,
							lastname: userDocSnap.data().lastname,
							email: userDocSnap.data().email,
							skills: userDocSnap.data().skills,
							...(userDocSnap.data().companyname && {
								skills: userDocSnap.data().companyname,
							}),
							...(userDocSnap.data().resumeURL && {
								cv: userDocSnap.data().resumeURL,
							}),
							...(userDocSnap.data().profilePicURL && {
								picURL: userDocSnap.data().profilePicURL,
							}),
						},
						post: {
							id: postId,
							title: postSnap.data().title,
							employer: postSnap.data().employer,
							text: postSnap.data().text,
							postedAt: postSnap.data().postedAt,
							skills: postSnap.data().jobSkills,
							...(userDoc.role === "recruiter" && {
								applicants: postSnap.data().applicants,
							}),
							...(userDoc.role === "recruiter" && {
								seenApplicants: postSnap.data().seenApplicants,
							}),
							...(userDoc.role === "recruiter" && {
								likedApplicants: postSnap.data().likedApplicants,
							}),
						},
					};

					chats.push(chat);
				} catch (e) {
					console.error("Error fetching user data:", e);
					alert(e);
				}
			}
			setChatList(chats);
		} else {
			setChatList([]);
		}
	};

	useEffect(() => {
		if (userDoc) {
			fetchChatList();
		}
	}, [userDoc]);

	/*
	useEffect(() => {
		const setUserToken = async () => {
			if (userAuth && userDoc) {
				try {
					const token = await getToken(messaging);
					console.log("FCM Token:", token);
					if (token !== userDoc.role) {
						setUserDoc((prevUserDoc) => ({
							...prevUserDoc,
							token: token,
						}));
						await updateDoc(doc(db, "users", userAuth.uid), {
							token: token,
						});
					}

					// You can send this token to your backend if needed
				} catch (error) {
					console.error("Error getting FCM token:", error);
				}
			}
		};
		setUserToken();
	}, [userAuth]);
	*/

	return (
		<AuthContext.Provider
			value={{ userAuth, setUserAuth, userDoc, setUserDoc, chatList, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
