/*
Title: Display Post Page

Description:
	Displays the full Job Post description
	No need to fetch the Job Post info
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
