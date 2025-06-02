/*
Title: Display Post Page

Description:
	Displays the full Job Post description
*/

import { useLocalSearchParams } from "expo-router";
import { SeePostPage } from "../../../components/SeePostPage";

export default function Page() {
	const { postId } = useLocalSearchParams<{ postId: string }>();
	return <SeePostPage postId={postId}></SeePostPage>;
}
