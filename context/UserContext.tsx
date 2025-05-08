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
	/*
	useEffect(() => {
		const unsubscribe = onSnapshot(doc(db, "users", userAuth?.uid), (snapshot) => {});
	}, [userAuth]);
    */
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
