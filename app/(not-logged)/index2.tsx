/*
Title: First landing page of the App

Description:
	Contains company name, logo, login and sign up buttons
*/

import { View, Text, StyleSheet, Button } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function Index() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.titleText}>APP NAME</Text>
				<Image
					source={require("../../assets/app_logo.svg")}
					style={styles.logo}
				/>
			</View>
			<View style={styles.middle}>
				<Text style={styles.descriptionText}>The best app in the world</Text>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomButton}>
					<Button
						color={Colors.primary}
						title="LOGIN"
						onPress={() => router.push("/login")}
					/>
					<Button
						color={Colors.secondary}
						title="SIGNUP WITH EMAIL"
						onPress={() => router.push({ pathname: "/signup/signup1" })}
					/>
				</View>
			</View>
		</View>
	);
}

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

	// This part of the styleSheet is specific to this page
	titleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
	},
	logo: {
		alignSelf: "center",
		height: 100,
		width: 100,
	},
	descriptionText: {
		fontSize: 30,
		alignSelf: "center",
	},
	middle: {
		width: "100%",
	},
});
