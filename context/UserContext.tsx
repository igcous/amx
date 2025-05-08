import React, {
	createContext,
	useContext,
	useState,
	PropsWithChildren,
	useEffect,
} from "react";
import { db } from "../config/firebaseConfig";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";

type UserContextType = {
	userDoc: DocumentData | null;
	setUserDoc: React.Dispatch<React.SetStateAction<DocumentData | null>>;
	loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
	const { userAuth } = useAuth();
	const [userDoc, setUserDoc] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let unsubscribe: (() => void) | undefined;

		if (userAuth) {
			// Set up Firestore listener for the user's document
			unsubscribe = onSnapshot(
				doc(db, "users", userAuth.uid),
				(docSnap) => {
					if (docSnap.exists()) {
						setUserDoc(docSnap.data());
						console.log("User doc updated:", docSnap.data());
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

		// Cleanup Firestore listener when the component unmounts or userAuth changes
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [userAuth]);

	return (
		<UserContext.Provider value={{ userDoc, setUserDoc, loading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserDoc = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserDoc must be used within an UserProvider");
	}
	return context;
};
