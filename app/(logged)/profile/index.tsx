/*
Title: Profile Page

Description:
	Landing page when the user logs in
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

		For Recruiter:
			Add socials link (TODO)
*/

import { useEffect, useState } from "react";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useAuth } from "../../../context/AuthContext";
import { auth, db, storage } from "../../../config/firebaseConfig";
import { Colors } from "../../../constants/colorPalette";
import { signOut } from "firebase/auth";
import styles from "./style";

export default function Page() {
	const { userAuth, userDoc, setUserDoc } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [displayPick, setDisplayPick] = useState<boolean>(false);

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
				//console.log("Image uploaded successfully:", snapshot.metadata);

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
				//setImageSource({ uri: downloadURL });
			}
			/*else {
				console.log("Image picker canceled");
			}*/
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
				//console.log("Document uploaded successfully:", snapshot.metadata);

				const downloadURL = await getDownloadURL(docuRef);
				if (userAuth?.uid) {
					await updateDoc(doc(db, "users", userAuth.uid), {
						resumeURL: downloadURL,
					});
				} else {
					console.error("User ID is undefined");
				}
				setUserDoc({ ...userDoc, resumeURL: downloadURL });
				alert("CV uploaded successfully!");
			} else {
				//console.log("Document picker canceled");
				alert("CV not uploaded!");
			}
		} catch (error) {
			console.error("Error picking or uploading document:", error);
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
			//console.log("Browser result:", result);
		} catch (error) {
			console.error("Error downloading file:", error);
			alert("Failed to download the file. Please try again.");
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			await signOut(auth);
		} catch (e) {
			console.error("Logout failed:", e);
			alert(e);
		} finally {
			setLoading(false);
		}
	};

	return !userDoc || loading ? (
		<ActivityIndicator
			size="large"
			color={Colors.primary}
			style={{
				flex: 1,
				backgroundColor: Colors.background,
				justifyContent: "center",
				alignItems: "center",
				transform: [{ scale: 2 }],
			}}
		/>
	) : (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.title}>
					{userDoc?.firstname + " " + userDoc?.lastname}
					{userDoc?.role === "recruiter" ? ", " + userDoc?.companyname : ""}
				</Text>

				{/* Add/Change user profile picture */}
				<Pressable
					style={styles.image}
					onPress={() => setDisplayPick(!displayPick)}>
					<Image
						contentFit="cover"
						source={
							userDoc?.profilePicURL
								? { uri: userDoc?.profilePicURL }
								: require("../../../assets/profile_icon.svg")
						}
						style={{ flex: 1 }}
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
					<View style={styles.skillDeck}>
						{userDoc?.skills.map((skill: string, index: number) => (
							<Pressable
								onPress={() => {
									router.push({
										pathname: "/profile/editskills",
									});
								}}
								key={index}
								style={styles.skillCard}>
								<Text style={styles.skillCardText}>{skill}</Text>
							</Pressable>
						))}
					</View>
				) : (
					<></>
				)}
			</View>
			<View style={styles.bottom}>
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
				{userDoc?.role === "searcher" ? (
					<Pressable
						style={[
							styles.bottomButton,
							{
								backgroundColor: Colors.primary,
							},
						]}
						onPress={() => {
							router.push({
								pathname: "/profile/apphistory",
							});
						}}>
						<Text style={styles.bottomButtonText}>SEE APPLICATIONS</Text>
					</Pressable>
				) : (
					<></>
				)}
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
					<Text style={styles.bottomButtonText}>LOGOUT</Text>
				</Pressable>
			</View>
		</View>
	);
}
