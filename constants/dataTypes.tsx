/*
Title: Data Types

Description:
	Types defined to make the handling of Firebase docs easier
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
