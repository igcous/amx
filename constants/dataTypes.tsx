/*
Title: Data Types

Description:
	These types are defined to make the handling of Firebase docs easier
	Note: Firebase has a all-or-nothing document retrieval policy (in other words, no SQL select statement)

*/

import { Timestamp } from "firebase/firestore";

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
