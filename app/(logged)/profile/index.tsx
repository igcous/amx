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

// React - React Native
import { useState } from "react";
import {
	StyleSheet,
	ScrollView,
	Text,
	View,
	Pressable,
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
	const [displayPick, setDisplayPick] = useState<boolean>(false);
	const { userAuth, userDoc, setUserDoc, loading: loadingData } = useAuth();
	const router = useRouter();

	// useImage Hook does not work for fallback, use this instead
	const [imageSource, setImageSource] = useState(
		userDoc?.profilePicURL
			? { uri: userDoc.profilePicURL }
			: require("../../../assets/profile_icon.svg")
	);

	const pickImage = async (useCamera: boolean) => {
		try {
			const result = useCamera
				? await ImagePicker.launchCameraAsync({
						mediaTypes: "images",
						allowsEditing: true,
				  })
				: await ImagePicker.launchImageLibraryAsync({
						mediaTypes: "images",
						allowsEditing: true,
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

				// Add the image download URL to the user document and context
				const downloadURL = await getDownloadURL(imageRef);
				if (userAuth?.uid) {
					await updateDoc(doc(db, "users", userAuth.uid), {
						profilePicURL: downloadURL,
					});
				} else {
					console.error("User ID is undefined");
				}

				// Update context too
				setUserDoc({ ...userDoc, profilePicURL: downloadURL });

				// Update image source
				setDisplayPick(false);
				setImageSource({ uri: downloadURL });
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
				alert("No uploaded CV found.");
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

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>
						{userDoc?.firstname + " " + userDoc?.lastname}
					</Text>

					{/* Add/Change user profile picture */}
					<Pressable
						style={styles.image}
						onPress={() => setDisplayPick(!displayPick)}>
						<Image
							contentFit="cover"
							source={imageSource}
							style={{ flex: 1 }}
							onError={() =>
								setImageSource(require("../../../assets/profile_icon.svg"))
							}
						/>
						{displayPick ? (
							<View style={styles.pickImage}>
								<Pressable
									onPress={() => {
										pickImage(false);
									}}
									style={[styles.pickImageOptions]}>
									<Text style={styles.pickImageText}>Pick from device</Text>
								</Pressable>
								<Pressable
									onPress={() => pickImage(true)}
									style={styles.pickImageOptions}>
									<Text style={styles.pickImageText}>Use camera</Text>
								</Pressable>
							</View>
						) : null}
					</Pressable>

					{/* Only for searcher*/}
					{/* Note: keep separated for easier formatting */}
					{/* Show user current skills */}

					{userDoc?.role === "searcher" && userDoc?.skills ? (
						<View style={styles.deck}>
							<Text style={styles.descriptionText}>Your skills</Text>
							{userDoc?.skills.map((skill: string, index: number) => (
								<Pressable
									onPress={() => {
										router.push({
											pathname: "/profile/editskills",
										});
									}}
									key={index}
									style={styles.card}>
									<Text style={styles.cardText}>{skill}</Text>
								</Pressable>
							))}
						</View>
					) : (
						<></>
					)}

					{/* Add CV */}
					{userDoc?.role === "searcher" ? (
						<View style={styles.cv}>
							<Pressable style={styles.cvButton} onPress={pickDocumentFile}>
								<Text style={styles.cvButtonText}>ADD CV</Text>
							</Pressable>
							<Pressable style={styles.cvButton} onPress={downloadDocumentFile}>
								<Text style={styles.cvButtonText}>DOWNLOAD CV</Text>
							</Pressable>
						</View>
					) : (
						<></>
					)}

					{userDoc?.role === "recruiter" ? (
						<Text style={styles.titleText}>{userDoc.companyname}</Text>
					) : (
						<></>
					)}
				</View>
				<View style={styles.bottom}>
					<Pressable
						style={[
							styles.bottomButton,
							{
								backgroundColor:
									userDoc?.role === "recruiter"
										? Colors.secondary
										: Colors.primary,
							},
						]}
						onPress={logout}>
						<Text style={styles.buttonText}>LOGOUT</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
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
		marginTop: 20,
		gap: 20,
	},
	bottom: {
		width: "100%",
		marginBottom: 40,
		gap: 20,
	},
	bottomButton: {
		alignSelf: "center",
		width: "90%",
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},

	// This part of the styleSheet is specific to this page
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		textAlign: "center",
		marginBottom: 10,
	},
	descriptionText: {
		width: "90%",
		fontSize: 20,
		alignSelf: "center",
		textAlign: "center",
	},
	card: {
		alignSelf: "center",
		marginBottom: 10,
		backgroundColor: Colors.tertiary,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		borderRadius: 30,
		borderWidth: 3,
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
		marginBottom: 20,
	},
	image: {
		width: width * 0.8, // 4:3 aspect ratio
		height: width * 0.6,
		//borderWidth: 5, // remove this
		alignSelf: "center",
		zIndex: 0,
	},

	activityIndicator: {},
	cv: {
		flex: 1,
		width: "90%",
		alignSelf: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	cvButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	cvButtonText: {
		fontSize: 16,
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	editButton: {
		alignSelf: "center",
		width: "90%",
		gap: 20,
	},
	editButtonText: {
		fontSize: 20,
	},
	pickImage: {
		position: "absolute", // Ensure it overlays the Image
		zIndex: 1, // Higher zIndex to appear on top of the Image
		gap: 20,
		flexDirection: "row",
		alignSelf: "center",
	},
	pickImageOptions: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: Colors.primary,
	},
	pickImageText: {
		color: "white", // Text color for visibility
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
});
