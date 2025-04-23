import {
	StyleSheet,
	ScrollView,
	Text,
	View,
	Button,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colorPalette";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Image } from "expo-image";
import { doc, updateDoc } from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";

export default function Page() {
	const [loading, setLoading] = useState<boolean>(true);
	const { userAuth, userDoc, setUserDoc, loading: loadingData } = useAuth();
	// can do something with 'loadingData' but user has to be accessed as 'user?' regardless
	const router = useRouter();

	const pickImage = async () => {
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

				const downloadURL = await getDownloadURL(imageRef);
				// This is done similarly in editskills (updateDoc for persistence + setUserDoc for context)
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
		try {
			const result = await DocumentPicker.getDocumentAsync({
				multiple: false,
				type: ["application/pdf"],
			});

			// Check if the user canceled the picker
			if (!result.canceled) {
				// Fetch the image as a Blob
				const response = await fetch(result.assets[0].uri);
				const imageBlob = await response.blob();

				// Upload the image to Firebase Storage, ref to destination
				const target = "/documents/cv/" + userAuth?.uid + ".pdf";
				const imageRef = ref(storage, target);
				const snapshot = await uploadBytes(imageRef, imageBlob, {
					contentType: "application/pdf", // jpeg for smaller size, lossy
				});
				// see "common examples" for contentType, https://en.wikipedia.org/wiki/Media_type

				console.log("Document uploaded successfully:", snapshot.metadata);

				const downloadURL = await getDownloadURL(imageRef);
				// This is done similarly in editskills (updateDoc for persistence + setUserDoc for context)
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
			alert("Failed to upload document. Please try again."); // Should check uploaded file format?
		}
	};

	/*
	const shareFile = async (fileUri: string) => {
		try {
			const isAvailable = await Sharing.isAvailableAsync();
			if (isAvailable) {
				await Sharing.shareAsync(fileUri);
			} else {
				alert("Sharing is not available on this device.");
			}
		} catch (error) {
			console.error("Error opening file:", error);
		}
	};
	*/

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

	return (
		<View style={styles.container}>
			{/*<Button title="Get user data" onPress={() => getData()}></Button>*/}

			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.top}>
					<Text style={styles.titleText}>Profile</Text>
				</View>

				{/*TODO: make SVG import prettier, look in https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md*/}

				{/*TODO: add/change user profile picture, use press/longpress*/}
				<Pressable onLongPress={pickImage}>
					{userDoc?.profilePicURL ? (
						<Image
							contentFit="contain"
							cachePolicy="none"
							source={{ uri: userDoc.profilePicURL }}
							style={styles.image}
						/>
					) : (
						<Image
							source={require("../../assets/profile_icon.svg")}
							style={styles.image}
						/>
					)}
				</Pressable>

				{/*TODO: show user info*/}
				<Text>{userDoc?.firstname}</Text>
				<Text>{userDoc?.lastname}</Text>
				<Text>{userDoc?.email}</Text>

				{/*TODO: show/list user skills*/}
				{/*TODO: optional, check role for formatting profile*/}
				{userDoc?.skills ? (
					userDoc?.skills.map((skill: string, index: number) => (
						<Pressable key={index} style={styles.card}>
							<Text style={styles.cardText}>{skill}</Text>
						</Pressable>
					))
				) : (
					<></>
				)}

				{/*TODO: edit user skills (button)*/}
				<Pressable
					onPress={() => {
						router.navigate("/editskills");
					}}>
					<Text>Edit</Text>
				</Pressable>

				{/*TODO: add CV*/}
				<Pressable onPress={pickDocumentFile}>
					<Text>Add CV</Text>
				</Pressable>
				<Pressable onPress={downloadDocumentFile}>
					<Text>Download current CV</Text>
				</Pressable>

				<Button title="Logout" onPress={logout}></Button>
			</ScrollView>
		</View>
	);
}

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
	inputLabel: {
		fontSize: 20,
	},
	inputBox: {
		width: "100%",
		textAlign: "center",
		borderBottomWidth: 4,
		borderBottomColor: Colors.secondary,
		alignSelf: "center",
	},
	titleText: {
		width: "90%",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 20,
	},
	descriptionText: {
		width: "90%",
		fontSize: 20,
		alignSelf: "center",
		marginBottom: 10,
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
		width: 100,
		height: 100,
	},
});
