import { swipe } from "./v2/swipe.js";
import { signUsers, createPosts } from "./v2/populate.js";

console.log("Starting swipe...");
await swipe();
console.log("Finished swipe.");

console.log("Starting signUsers...");
await signUsers();
console.log("Finished signUsers.");

/*
console.log("Starting createPosts...");
await createPosts();
console.log("Finished createPosts.");
*/

console.log("Success!");
