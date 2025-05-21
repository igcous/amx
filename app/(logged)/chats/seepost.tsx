/*
Title: Display Post Page

Description:
	See the full job description
		Useful when job post does not fit the card and a ScrollView is needed
*/

import { useLocalSearchParams } from "expo-router";
import { SeePostPage } from "../../../components/SeePostPage";

export default function Page() {
	const { postId, chatId } = useLocalSearchParams<{
		postId: string;
		chatId: string;
	}>();
	return <SeePostPage postId={postId} chatId={chatId}></SeePostPage>;
}
