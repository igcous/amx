/*
Title: First landing page of the App

Description:
	Contains company name, logo, login and sign up buttons
*/

import { View, Text, Pressable } from "react-native";
import { Colors } from "../../constants/colorPalette";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import styles from "./style";

export default function Index() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={[styles.top, { justifyContent: "space-around" }]}>
				<Image
					source={require("../../assets/amx_logo.png")}
					style={styles.logo}
				/>
				<View style={styles.middle}>
					<Text style={styles.middleText}>
						Swipe. Apply. <Text style={{ fontWeight: "bold" }}>Hired.</Text>
					</Text>
				</View>
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
