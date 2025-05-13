import { readFile, writeFile } from "fs/promises";
import {
	skills,
	firstnames,
	lastnames,
	companies,
	cvURLS,
	profilePicURLS,
} from "./constants.js";

// Create users from dummy file
export const saveUsers = async (n) => {
	try {
		const data = await readFile("./v2/testUsers.json", "utf-8");
		let users = JSON.parse(data);

		// Concat randomly generated user to fixed users
		const newUsers = generateUser(20, users.length);

		await writeFile(
			"./v2/users.json",
			JSON.stringify([...users, ...newUsers], null, 2),
			"utf-8"
		);

		console.log("All test users have been created.");
	} catch (e) {
		console.error("Error reading or parsing users.json:", e);
	}
};

export const generateUser = (total, index) => {
	const randomBool = () => Math.random() < 0.5;
	const randomSkillLength = () => Math.floor(Math.random() * 5) + 1;
	const randomSkill = () => Math.floor(Math.random() * skills.length);
	const randomPic = () => Math.floor(Math.random() * profilePicURLS.length);
	const random = () => Math.floor(Math.random() * firstnames.length); // same length as lastnames and companies

	// TODO: Add profile pic link

	let users = [];

	for (let i = 0; i < total - index; i++) {
		if (randomBool()) {
			// searcher or recruiter
			const userSkillsLength = randomSkillLength(); // [0,4] + 1;
			let userSkills = [];
			do {
				const newSkill = skills[randomSkill()];
				if (!userSkills.includes(newSkill)) {
					userSkills.push(newSkill);
				}
			} while (userSkills.length < userSkillsLength);

			users[i] = {
				role: "searcher",
				email: "test" + (index + i) + "@mail.com",
				firstname: firstnames[random()],
				lastname: lastnames[random()],
				skills: userSkills,
				profilePicURL: profilePicURLS[randomPic()],
				resumeURL: cvURLS[0],
				...(randomBool() && { companyname: companies[random()] }), // may have companyname
			};
		} else {
			users[i] = {
				role: "recruiter",
				email: "test" + (index + i) + "@mail.com",
				firstname: firstnames[random()],
				lastname: lastnames[random()],
				profilePicURL: profilePicURLS[randomPic()],
				companyname: companies[random()],
			};
		}
	}
	return users;
};

saveUsers();
