# Study 1 design and provenance

Approved by David Rose on October 31, 2026. Source materials: `Study 1.docx`.
The document is stimulus source material; David's spoken revisions and approval
control the implementation.

One species, virdexes, in three between-participant conditions: control,
survival benefit, and ecological benefit. Local participant previews use an
unbiased random draw with equal probabilities. Actual balanced allocation is
to be controlled by the Study Console, with equal condition targets once a
total sample size has been chosen. Each person sees only one story version.

The common setup and condition passages follow the source document, with a
final full stop added to the control passage. The first, second, and fourth
statements retain the source wording. The approved value statement is:

> Virdexes with spots are valuable, and that value would be lost if virdexes stopped having spots.

All four questions have the same agreement probe and seven fully labeled options:
1 Strongly disagree; 2 Disagree; 3 Somewhat disagree; 4 Neither agree nor disagree;
5 Somewhat agree; 6 Agree; 7 Strongly agree.

Question order is fixed in source order. An explanation is collected after each
rating, including the fourth question. The explanation box appears after a rating
is selected, following David's instruction rather than the document's preliminary
note to show it while rating. Reviewers may reveal it without answering.

The story and both images are retained above each active question. No benefit
condition labels appear in the participant flow. The reviewer panel is separate
from the participant entry. The local review entry never loads the collection
client or submits responses.

Consent and visual treatment derive from
`explanation-lab/causal-verbs-cross-cultural/Pilots/Factivity/` and its underlying
Absences layout. Study-specific prose describes one fictional animal and four
judgments. Contact and voluntary-participation language are retained. The five
minute duration is a pilot estimate; compensation refers to the recruitment
listing. No protocol identifier, sample size, or Prolific completion code is
invented.

Version 1.1.0 replaces the standalone feedback screen with optional age, gender,
race and ethnicity. Wording, response options, Other text fields and age bounds
(18–100) follow the final demographics in
`Purpose_norms/docs/life_meaning_v1/js/screens.js` and
`Purpose_norms/docs/animal_goodness_v8/js/screens.js`. The related chats
“Add life meaning study” and “Create animal goodness study” were consulted.
Only the demographics portion is reused, following David's request to replace
the feedback form. No feedback text boxes remain. Participants can leave any or
all demographic items blank and press Finish. The reviewer panel has a direct
Demographics entry. The new version uses separate browser storage so a completed
older preview cannot skip the added form.

## Export fields

Each response records the assigned condition; exact setup, ending and statement;
question ID and position; scale bounds and labels; rating and selected label;
explanation; time to first rating selection and total screen response time;
image paths; version; session ID; stable screen index; and preview flags.
`trial_role=response` identifies the four main observations. Free text is escaped
when redisplayed, and CSV quotes are escaped. Real participant data do not belong
in the repository.

The final record uses `trial_role=demographics` and flat fields `age`, `gender`,
`other_gender`, `race`, `other_race`, and `ethnicity`. Blank responses are null.
Local JSON includes those values and a separate one-row demographics CSV is
available. Collection metadata and the upload manifest declare the same six
fields for the Console's demographic export.

Offline/local preview records always carry `valid_participant_data=false`.
The separate upload entry includes the frozen official client 1.5.1, reads the
Console-assigned condition, validates the study version and all three conditions,
and saves before completion. Failed saves show a retry control. Collection storage
is isolated by study, mode, participant and condition. Completed-session reloads
restore all responses before attempting another save; a regression test covers
this behavior. The package still needs hosting, Console registration and live
Sandbox verification before collecting actual data.

Reloads preserve consent, condition and completed local
screens when browser storage is available. Refusal clears the current local
response state and stops the study.
