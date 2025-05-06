import { Timestamp } from "firebase/firestore";

// Post data
// hide applicants for Searchers
export type Post = {
	id: string;
	title: string;
	employer: string;
	text: string; // description, content
	postedAt: Timestamp;
	postSkills: string[];
	applicants: string[]; // applicant ids
	seenApplicants: string[]; // already swiped applicants id
};

// Searcher/Applicant seen from Recruiter side
//
export type Searcher = {
	id: string;
	firstname: string;
	lastname: string;
	skills: string[];
	email: string;
	// hide chatIds
};
