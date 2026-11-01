# Study 1 — three-animal revision, version 2.1.0

Revised at David Rose's request on October 31, 2026. The original Study 1.docx
and user-provided Nalk and Marvin vignettes are stimulus sources; David's
instructions and subsequent image/wording corrections control implementation.

Each participant sees Virdexes, Nalks and Marvins, with a single assigned
between-participant condition (control, survival benefit or ecological benefit)
held constant across all three animals. Animal order is randomized uniformly
among six permutations and saved for reload recovery. Reviewer order is fixed
Virdexes, Nalks, Marvins so screen navigation is predictable.

Each animal has a story/image screen followed by five measures:
comparative importance, survival importance, value, significance, and wrongness.
One question order is randomly drawn per participant and reused across all three
animals. Both item and question orders are saved and exported. The reviewer uses
canonical question order for predictable screen navigation.
The approved Virdex significance statement is: “Virdexes with spots have a
significance that is missing in virdexes without spots.” Statements are parallel
across species: spots; dense hair along their fins; spikes on their feet.
The value statement retains the approved “that value would be lost” wording.
All 15 statements use the identical seven fully labeled agreement options from
Strongly disagree (1) to Strongly agree (7), neutral at 4. Each rating is followed
by a required nonblank explanation, revealed only after choosing the rating.
Case and both matched images remain above each active question.

Nalk control transcription was corrected with David's authorization to: “When
nalks dive underwater, they carry the air bubbles down, producing harmless bubbles
on the pond.” Marvin control grammar was corrected to “The exposed seeds make
the grass look more blue, but do not harm the grass.” David subsequently requested
normal feet rather than claws, and many spikes versus none. Marvin setup,
questions, captions and alternative text consistently use spikes on feet.

Matched images are fictional natural-history illustrations for adult research.
Nalk fin hair and Marvin foot spikes are deliberately prominent at display size.
The final Marvin is a different russet mammal-like animal with natural small feet
and ordinary toes; no pincers or enlarged boot-like pads. Only the final six
stimulus images are included in packages. Prompts and generation history are in
assets/IMAGE_PROVENANCE.md; superseded drafts are outside the runtime.

Consent and visual treatment follow causal-verbs-cross-cultural/Pilots/Factivity.
Consent now refers to animals in the plural. Duration is provisionally 10–15
minutes and needs piloting before recruitment. David's approved concise
instructions are unchanged. Purpose Norms demographics appear once at the end;
age 18–100, gender and race with Other text fields, and ethnicity are optional.
The canonical demographic trial tag remains `demographic`.

## Data and recovery

There are 21 saved trial screens: consent, instructions, three stories, 15
rating/explanation pairs and demographics. Thank you is not a saved trial.
Each rating has unique species-plus-measure `question_id`; `item_id` and `species`
identify the animal, `measure` identifies the parallel measure, `item_position`
is animal presentation order and `question_position` is overall rating order.
Within-item position is also recorded. Exact case, statement, images and scale
labels are included. Completion requires exactly one valid response for every
species/measure combination and a demographics record. Browser storage is
version-separated and includes animal order. Reload restores earlier records
into jsPsych before saving; failed saves offer retry without premature redirect.
Local/review exports are always marked invalid for participant analysis.

## Release status

This version is separately hosted under /expanded/ and registered as
NORMS-TELEOLOGY-THREE-ANIMAL-UVMR with 25 per condition / 75 total. Three actual
hosted Sandbox sessions passed; their downloaded 45 ratings and 63 raw trials
were independently audited. Final preflight leaves only David's Prolific
completion URL and configuration confirmation. See docs/STUDY1_EXPANDED_CONSOLE.md
in the repository. No production data have been collected for this version.
The original collection and root hosted 1.1.1 release remain unchanged.
