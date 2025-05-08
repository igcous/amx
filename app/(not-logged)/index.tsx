/*
Title: First landing page of the App

Description:
	Contains company name, logo, login and sign up buttons
*/

import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import styles from "./style";

export default function Index() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Image source={require("../../assets/logo.png")} style={styles.logo} />
			</View>
			<View style={styles.middle}>
				<Text style={styles.middleText}>Swipe. Apply. Hired.</Text>
			</View>
			<View style={styles.bottom}>
				<Pressable
					style={[styles.bottomButton, { backgroundColor: Colors.primary }]}
					onPress={() => router.push("/login")}>
					<Text style={styles.bottomButtonText}>LOGIN</Text>
				</Pressable>
				<Pressable
					style={[styles.bottomButton, { backgroundColor: Colors.secondary }]}
					onPress={() => router.push({ pathname: "/signup/signup1" })}>
					<Text style={styles.bottomButtonText}>SIGNUP WITH EMAIL</Text>
				</Pressable>
			</View>
		</View>
	);
}

const { width, height } = Dimensions.get("window");

/*
const styles = StyleSheet.create({
	// This part of the styleSheet is repeatable, do not change
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		justifyContent: "space-between",
		alignItems: "center",
	},
	top: {
		width: "100%",
		marginTop: 60,
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
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
	},
	logo: {
		width: "50%",
		height: 100,
		alignSelf: "center",
	},
	descriptionText: {
		fontSize: 30,
		alignSelf: "center",
		fontStyle: "italic",
	},
	middle: {
		width: "100%",
		padding: 10,
		backgroundColor: Colors.tertiary,
	},
});
*/
