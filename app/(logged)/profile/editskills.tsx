/*
Title: Edit Skills Page

Description:
    Based on the Skill Deck component, similar to what is done on Signup (signup3.tsx)
	To re-select skills
*/

import { SelectSkillsPage } from "../../../components/SelectSkillsPage";

export default function Page() {
	return (
		<SelectSkillsPage
			goBackTo="/profile"
			textHeader="Field of Work"
			textDescription="Choose your skills"
			saveToUserDoc={true}></SelectSkillsPage>
	);
}
