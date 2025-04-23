import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from "react";
import { auth, db, storage } from "../config/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, DocumentData } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

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
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setLoading(true);
			setUserAuth(currentUser);
			console.log("User state changed:", currentUser);

			if (currentUser !== null) {
				const fetchUserData = async () => {
					try {
						const docRef = doc(db, "users", currentUser!.uid);
						const docSnap = await getDoc(docRef);
						if (docSnap.exists()) {
							const data = docSnap.data();
							setUserDoc(data);
						}
					} catch (e) {
						console.log(e);
						alert(e);
					}
				};

				fetchUserData();
			} else {
				setUserDoc(null);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{ userAuth, userDoc, setUserAuth, setUserDoc, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

/*
export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [userAuth, setUserAuth] = useState<User | null>(null);
	const [userDoc, setUserDoc] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setLoading(true);
			if (currentUser) {
				console.log("User state changed:", currentUser);
				const fetchUserData = async () => {
					try {
						// Fetch user data from Firestore
						const docRef = doc(db, "users", currentUser.uid);
						const docSnap = await getDoc(docRef);

						if (docSnap.exists()) {
							const data = docSnap.data();
							setUserDoc(data);
						} else {
							console.warn("No such document in Firestore!");
						}
					} catch (e) {
						console.error("Error fetching user data:", e);
						alert(e);
					}
				};
				fetchUserData();
				setUserAuth(currentUser);
			} else {
				setUserDoc(null);
				setUserAuth(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ userAuth, userDoc, loading }}>
			{children}
		</AuthContext.Provider>
	);
};
*/

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

/*
interface AuthContextType {
	user: User | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			//console.log("User state changed:", currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
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
*/
