import { Stack, Redirect, Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
	const { userAuth } = useAuth();

	return userAuth ? <Redirect href="/(logged)/profile"></Redirect> : <Stack />;
}
