/*
Title: Edit Skills Page

Description:
    Based on the Skill Deck component, similar to what is done on Signup (signup3.tsx) but for new Job Posts
*/

import { SelectSkillsPage } from "../../../components/SelectSkillsPage";

export default function Page() {
	return (
		<SelectSkillsPage
			goBackTo="/post/newpost"
			textHeader="Field of Work"
			textDescription="Choose the required job skills"
			saveToUserDoc={false}></SelectSkillsPage>
	);
}
