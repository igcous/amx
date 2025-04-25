/*
Title: Profile Page

Description:
	This is the landing page when the user logs in
	Features
		For every user:
			Show profile picture
			Pick/Edit profile picture
			Show user info

		For Searcher:
			Show skills
			Edit skills
			Add CV file
			Download CV file
				Tried a couple things but the easiest solution is to let Web Browser handle it

		For Recruiter:
			Add socials link (TODO)

	
		*/

// React / React Native
import { useState } from "react";
import {
	StyleSheet,
	ScrollView,
	Text,
	View,
	Button,
	Pressable,
	ActivityIndicator,
	Dimensions,
} from "react-native";
// Expo utilities
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
// Firebase
import { doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
// Defined by me
import { useAuth } from "../../../context/AuthContext";
import { auth, db, storage } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import { signOut } from "firebase/auth";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(false);
	const { userAuth, userDoc, setUserDoc, loading: loadingData } = useAuth();
	const router = useRouter();

	const pickImageFile = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: "images",
				allowsEditing: false,
				aspect: [4, 3],
				quality: 1,
			});

			// Check if the user canceled the picker
			if (!result.canceled) {
				// Fetch the image as a Blob
				const response = await fetch(result.assets[0].uri);
				const imageBlob = await response.blob();

				// Upload the image to Firebase Storage, ref to destination
				const target = "/images/profile/" + userAuth?.uid + ".jpeg";
				const imageRef = ref(storage, target);
				const snapshot = await uploadBytes(imageRef, imageBlob, {
					contentType: "image/jpeg", // jpeg for smaller size, lossy
				});
				console.log("Image uploaded successfully:", snapshot.metadata);

				// Add the image donwload URL to the user document and context
				const downloadURL = await getDownloadURL(imageRef);
				if (userAuth?.uid) {
					await updateDoc(doc(db, "users", userAuth.uid), {
						profilePicURL: downloadURL,
					});
				} else {
					console.error("User ID is undefined");
				}
				setUserDoc({ ...userDoc, profilePicURL: downloadURL });
			} else {
				console.log("Image picker canceled");
			}
		} catch (error) {
			console.error("Error picking or uploading image:", error);
			alert("Failed to upload image. Please try again.");
		}
	};

	const pickDocumentFile = async () => {
		// Almost the same as pickImageFile
		try {
			const result = await DocumentPicker.getDocumentAsync({
				multiple: false,
				type: ["application/pdf"],
			});

			// Check if the user canceled the picker
			if (!result.canceled) {
				// Fetch the document as a Blob
				const response = await fetch(result.assets[0].uri);
				const docuBlob = await response.blob();

				// Upload the image to Firebase Storage, ref to destination
				const target = "/documents/cv/" + userAuth?.uid + ".pdf";
				const docuRef = ref(storage, target);
				const snapshot = await uploadBytes(docuRef, docuBlob, {
					contentType: "application/pdf",
				});
				// for contentType see "Common examples" in https://en.wikipedia.org/wiki/Media_type
				console.log("Document uploaded successfully:", snapshot.metadata);

				const downloadURL = await getDownloadURL(docuRef);
				if (userAuth?.uid) {
					await updateDoc(doc(db, "users", userAuth.uid), {
						resumeURL: downloadURL,
					});
				} else {
					console.error("User ID is undefined");
				}
				setUserDoc({ ...userDoc, resumeURL: downloadURL });
			} else {
				console.log("Document picker canceled");
			}
		} catch (error) {
			console.log("Error picking or uploading document:", error);
			alert("Failed to upload document. Please try again.");
		}
	};

	const downloadDocumentFile = async () => {
		try {
			if (!userDoc?.resumeURL) {
				alert("No resume URL found.");
				return;
			}
			const result = await WebBrowser.openBrowserAsync(userDoc.resumeURL);
			console.log("Browser result:", result);
		} catch (error) {
			console.error("Error downloading file:", error);
			alert("Failed to download the file. Please try again.");
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			await signOut(auth);
		} catch (e: any) {
			console.log("Logout failed:", e);
			alert(e);
		} finally {
			setLoading(false);
		}
	};

	return loadingData || loading ? (
		<ActivityIndicator
			size="large"
			color={Colors.primary}
			style={styles.activityIndicator}
		/>
	) : (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>
						{userDoc?.firstname + " " + userDoc?.lastname}
					</Text>

					{/* Add/change user profile picture */}
					<Pressable onLongPress={pickImageFile}>
						{userDoc?.profilePicURL ? (
							<Image
								contentFit="cover"
								cachePolicy="none"
								source={{ uri: userDoc.profilePicURL }}
								style={styles.image}
							/>
						) : (
							// No image fallback
							<Image
								contentFit="contain"
								source={require("../../../assets/profile_icon.svg")}
								style={styles.image}
							/>
						)}
					</Pressable>

					{/* Show user info*/}

					{/* Only for searcher*/}
					{/* Note: keep separated for easier formatting */}
					{/* Show user current skills */}

					<View style={styles.titleText}>
						<Text>Skills</Text>
					</View>
					<View style={styles.deck}>
						{userDoc?.role === "searcher" && userDoc?.skills ? (
							userDoc?.skills.map((skill: string, index: number) => (
								<Pressable key={index} style={styles.card}>
									<Text style={styles.cardText}>{skill}</Text>
								</Pressable>
							))
						) : (
							<></>
						)}
					</View>

					{/* Edit skills */}
					{userDoc?.role === "searcher" ? (
						<Pressable
							style={styles.editButton}
							onPress={() => {
								router.push("/profile/editskills");
							}}>
							<Text>Edit</Text>
						</Pressable>
					) : (
						<></>
					)}

					{/* Add CV */}

					<View style={styles.cv}>
						{userDoc?.role === "searcher" ? (
							<Pressable style={styles.addCv} onPress={pickDocumentFile}>
								<Text>Add CV</Text>
							</Pressable>
						) : (
							<></>
						)}

						{/* Download CV */}
						{userDoc?.role === "searcher" ? (
							<Pressable
								style={styles.downloadCv}
								onPress={downloadDocumentFile}>
								<Text>Download current CV</Text>
							</Pressable>
						) : (
							<></>
						)}
					</View>
				</View>
				<View style={styles.bottom}>
					<View style={styles.bottomButton}>
						<Button title="Logout" onPress={logout}></Button>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	// I will try to keep at least a part of the styleSheet that is repeatable
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

	// This is the styleSheet that is specific to this page
	input: {
		width: "90%",
		alignSelf: "center",
		marginBottom: 40,
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 20,
	},
	card: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
	},
	cardText: {
		fontSize: 20,
	},
	deck: {
		flexGrow: 1,
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
	},
	image: {
		width: width * 0.8, // 4:3 aspect ratio
		height: width * 0.6,
		borderWidth: 5, // remove this later
	},
	activityIndicator: {
		flex: 1,
		backgroundColor: Colors.background,
		justifyContent: "center",
		alignItems: "center",
		transform: [{ scale: 2 }],
	},
	cv: {},
	addCv: {},
	downloadCv: {},
	editButton: {},
});
