/*
Title: Data Types

Description:
	These types are defined to make the handling of Firebase docs easier
	Note: Firebase has a all-or-nothing document retrieval policy (in other words, no SQL select statement)

*/

import { Timestamp } from "firebase/firestore";

/*
// Post data
// note: hide applicants for Searchers
export type Post = {
	id: string;
	title: string;
	employer: string;
	text: string; // description, content
	postedAt: Timestamp; // Timestamp is Firebase's type for datetimes
	postSkills: string[];
	applicants: string[]; // applicant ids
	seenApplicants: string[]; // already swiped applicants id
	likedApplicants: string[]; //
};

// Searcher/Applicant seen from Recruiter side
export type Searcher = {
	id: string;
	firstname: string;
	lastname: string;
	skills: string[];
	email: string;
	cv: string;
};

// Chat Partner, or the other user in a Chat
export type ChatUser = {
	id: string;
	chatId: string;
	postId: string;
	firstname: string;
	lastname: string;
	companyname: string;
	jobtitle: string;
	picURL: string;
};
*/

// New types

export type ChatType = {
	id: string;
	user: UserType;
	post: PostType;
};

export type UserType = {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	skills: string[];
	companyname?: string;
	cv?: string;
	picURL?: string;
};

export type PostType = {
	id: string;
	title: string;
	employer: string;
	text: string; // description, content
	postedAt: Timestamp; // Timestamp is Firebase's type for datetimes
	skills: string[];
	applicants?: string[]; // applicant ids
	seenApplicants?: string[]; // already swiped applicants id
	likedApplicants?: string[]; //
};
