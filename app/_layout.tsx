import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { ColorThemeProvider } from "../context/ColorThemeContext";

export default function RootLayout() {
	// this layout exposes the AuthProvider to all, following the structure in
	// https://docs.expo.dev/router/advanced/authentication/
	// its a mix between that and also the React docs on how to use Context
	return (
		<ColorThemeProvider>
			<AuthProvider>
				<SafeAreaProvider>
					<Stack />
				</SafeAreaProvider>
			</AuthProvider>
		</ColorThemeProvider>
	);
}
