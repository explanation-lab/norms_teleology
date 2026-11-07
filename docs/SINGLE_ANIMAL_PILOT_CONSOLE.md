# Single-animal pilot Console setup

Ready for David to add the actual Prolific completion URL. Final preflight on
November 1, 2026 leaves exactly two actions: the completion URL and confirmation
of the real Prolific external link, 75 places and matching completion code.
The study is in Sandbox testing with zero production submissions.

- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-SINGLE-ANIMA-VSL7&data=sandbox&section=setup)
- Study: Norms Teleology — Single-Animal Pilot.
- Study ID: `NORMS-TELEOLOGY-SINGLE-ANIMA-VSL7`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- Targets: **25 control, 25 survival benefit, 25 ecological benefit; 75 total**.
- Hosted runtime: https://explanation-lab.github.io/norms_teleology/single-animal-pilot/
- Version: `norms-teleology-single-animal-pilot-1.0.0`; client 1.5.1;
  schema 2.0.0; assignment type `between_participant`.
- Immutable native release: `dist/norms-teleology-single-animal-pilot-console-1.0.0.zip`.
- Fingerprint: `3e7746bca36fae2fa24ba914328a015c98b7b445262d0eb7ddd1d5f80a0b9dc7`.
- Pages commit: `f7d46eb`; only the new `single-animal-pilot/` folder was added.

The Console's balanced single link assigns the benefit condition against the
25/25/25 targets. The browser independently samples one animal uniformly from
Virdex, Nalk and Marvin and shuffles the five questions once. Animal sampling
is random, not quota balanced. Each participant receives one story, five ratings
with required explanations, and optional demographics. Condition, animal and
question order persist across reloads. The revised value text, matched hoof-spike
images, concise instructions, consent and demographics match the approved review.

Six actual hosted Sandbox sessions passed, two per condition. Random draws
included all three species and different animals within every condition. The
export audit verified 54 raw trials, 30 ratings with explanations, 48 readable
response rows and six demographic rows. Exact cases, questions, image paths,
scale labels, question order and explanation text match the frozen source.
Ordinary, Other-text and all-blank demographics match the raw and CSV records.
Control reload after two responses preserved the next question and nine unique
screens; completed reload did not create another submission. All six official
condition verifications report matched. The full readable export recipe retains
all detected fields and is confirmed.

Local runtime tests cover all nine condition/animal combinations and all 120
question permutations, independent assignment draws, explanation gating,
incomplete-save rejection, partial reload, save retry and Sandbox duplicate
protection. They also pass against the actual converted native source. The
official converter made one expected change to the reviewer URL-condition
reader; the staging script verifies that exact change and no others. No frozen
configuration was edited by hand.

Recheck the test bundle with:
`python3 tools/validate_single_animal_sandbox.py /path/to/sandbox-data.zip`.
The shareable synthetic-only result is `SINGLE_ANIMAL_PILOT_SANDBOX_VERIFICATION.json`.
Raw exports and browser evidence remain in ignored `data/private/`.

For analysis, filter `trial_role == response`. Use `condition` (also preserved
as `benefit_condition` and `launch_condition`), `selected_animal_id`/`item_id`,
`measure`, `rating` and `explanation`. Each participant contributes five rating
records for one animal in one condition. Demographics have their own file.

David's remaining steps:

1. Add this pilot's actual Prolific completion URL in Setup & launch.
2. Copy the Console's single production link into Prolific, enter **75** places
   and choose the matching completion code. Confirm those real settings in Console.
3. Rerun preflight and verify the actual completion redirect before going Live.

The completion URL was left blank and Prolific-configured confirmation unchecked.
Earlier live studies and participant datasets are unchanged. Sandbox tests do
not consume any of the 75 production places. The duration remains provisionally
about five minutes.
