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
import { getDoc, doc, DocumentData } from "firebase/firestore";

type AuthContextType = {
	userAuth: User | null;
	userDoc: DocumentData | null;
	setUserAuth: React.Dispatch<React.SetStateAction<User | null>>;
	setUserDoc: React.Dispatch<React.SetStateAction<DocumentData | null>>;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [userAuth, setUserAuth] = useState<User | null>(null);
	const [userDoc, setUserDoc] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setLoading(true);
			setUserAuth(currentUser);
			console.log("User state changed:", currentUser?.uid);

			if (currentUser !== null) {
				try {
					const docSnap = await getDoc(doc(db, "users", currentUser.uid));
					if (docSnap.exists()) {
						setUserDoc(docSnap.data());
						console.log("User doc:", docSnap.data());
					} else {
						// Should never get here, there is always a doc for every user
						throw new Error("User document does not exist");
					}
				} catch (e) {
					console.log(e);
					alert(e);
				}
			} else {
				setUserDoc(null);
			}
			setLoading(false);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{ userAuth, userDoc, setUserAuth, setUserDoc, loading }}>
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
