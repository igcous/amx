/*
Title: First page of the Signup flow

Description:
	User chooses a role, Searcher or Recruiter
*/

import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/colorPalette";
import { useState } from "react";
import styles from "../style";

export default function Page() {
	const router = useRouter();
	const [roleSelection, setRoleSelection] = useState<string | null>(null);

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.title}>You are...</Text>
				<Pressable
					onPress={() => setRoleSelection("searcher")}
					style={{
						...styles.card,
						borderColor:
							roleSelection === "searcher" ? Colors.primary : Colors.background,
					}}>
					<Text style={styles.cardText}>Looking for a job</Text>
				</Pressable>
				<Pressable
					onPress={() => setRoleSelection("recruiter")}
					style={{
						...styles.card,
						borderColor:
							roleSelection === "recruiter"
								? Colors.secondary
								: Colors.background,
					}}>
					<Text style={styles.cardText}>Looking to hire</Text>
				</Pressable>
			</View>

			<View style={styles.bottom}>
				<Pressable
					disabled={!roleSelection}
					style={[
						styles.bottomButton,
						{
							backgroundColor: !roleSelection
								? "gray"
								: roleSelection === "recruiter"
								? Colors.secondary
								: Colors.primary,
						},
					]}
					onPress={() => {
						router.push({
							pathname: "/signup/signup2",
							params: { role: roleSelection },
						});
					}}>
					<Text style={styles.bottomButtonText}>CONTINUE</Text>
				</Pressable>
			</View>
		</View>
	);
}
