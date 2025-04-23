import { signUsers } from "./create_users.js";
import { deleteUsers } from "./delete_users.js";
import { addAllChats } from "./create_chats_2.js";
import {
	addPostsAs,
	addSeenPostToUser,
	addLikedPostToUser,
	getAllPosts,
	concatToUserField,
} from "./create_posts.js";

/*
await deleteUsers();
await signUsers();
//await addAllChats();
await addPostsAs("test3@mail.com", "123456");
*/
const posts = await getAllPosts();
/*
await addSeenPostToUser("test@mail.com", "123456", posts[0].id);
await addLikedPostToUser("test@mail.com", "123456", posts[0].id);
await addPublishedPostToUser("test@mail.com", "123456", posts[0].id);
*/
await concatToUserField(
	"publishedPosts",
	posts[0].id,
	"test3@mail.com",
	"123456"
);

console.log("Success!");
