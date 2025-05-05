import { Button, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { db } from "../../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import {
	doc,
	getDoc,
	getDocs,
	collection,
	where,
	addDoc,
	query,
	limit,
	updateDoc,
	orderBy,
	documentId,
	arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
	const router = useRouter();
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const [loading, setLoading] = useState<boolean>(true);
	const { application } = useLocalSearchParams<{ application: string }>();
	const [currentApplication, setCurrentApplication] = useState(
		JSON.parse(application)
	);

	// fetch if necessary

	return (
		<View>
			<Text>{currentApplication.firstname}</Text>
			<Text>{currentApplication.lastname}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollContent: {
		width: "100%",
		flexGrow: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	top: {
		width: "100%",
		marginTop: 40,
		gap: 20,
	},
	bottom: {
		width: "100%",
		marginBottom: 40,
	},
	bottomButton: {
		alignSelf: "center",
		width: "90%",
		gap: 20,
	},
});
