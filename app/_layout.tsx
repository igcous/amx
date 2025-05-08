/*
Title: Root app layout

Description:
	This layout file is used to expose the AuthProvider (defined in /context/AuthContext.tsx to all)
	Following the structure in https://docs.expo.dev/router/advanced/authentication/
	Its also a mix between that and the React Docs on how to use Context

TODO:
	Define Colors in a Context instead of /constants and then use this context for light and dark color themes
*/

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
	return (
		<AuthProvider>
			<UserProvider>
				<SafeAreaProvider>
					<Stack screenOptions={{ headerShown: false }} />
				</SafeAreaProvider>
			</UserProvider>
		</AuthProvider>
	);
}
