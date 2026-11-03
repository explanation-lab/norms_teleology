# Virdex norms pilot Console setup

Ready for David to add the actual Prolific completion URL. Final preflight on
November 3, 2026 leaves two actions: the completion URL and confirmation of the
actual Prolific external link, 75 places and matching completion code. The study
remains in Sandbox testing with zero production submissions and three test saves.

- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-VIRDEX-NORMS-N58B&data=sandbox&section=setup)
- Study: Norms Teleology — Virdex Norms Pilot.
- Study ID: `NORMS-TELEOLOGY-VIRDEX-NORMS-N58B`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- Targets: **25 control, 25 survival benefit, 25 ecological benefit; 75 total**.
- Hosted runtime: https://explanation-lab.github.io/norms_teleology/virdex-pilot/
- Version: `norms-teleology-virdex-pilot-1.0.0`; jsPsych 7.3.4; client 1.5.1;
  schema 2.0.0; assignment type `between_participant`.
- Frozen native release: `dist/norms-teleology-virdex-pilot-console-1.0.0.zip`.
- Fingerprint: `e3578ab84c4b4cb8ff9f3c5b1b203da653c4e2fad84b6b35efa2ee893b515337`.
- Pages commit: `6ba91e84d617a3c50a6f6d1a361c3d16f40bc352`.
  Only the new `virdex-pilot/` folder was added. Its Pages deployment succeeded.

The Console's balanced single link assigns one benefit condition per participant.
Everyone receives the revised Virdex case and the approved spotted/unspotted pair.
Four new statements replace the five previous questions, with one randomized
question order per participant and a required explanation following every rating:

1. Virdexes ought to have spots
2. It would be best for a Virdex to have spots
3. If a Virdex doesn’t have spots, there’s probably something wrong with it.
4. The spots make Virdexes especially important creatures.

All questions use the same labeled seven-point agreement scale. The story and
images remain above each question. Consent, concise instructions and optional
demographics match the approved reviewer. Condition and question order survive
reloads. Each complete session contains eight recorded screens and four responses.

## Verified Sandbox behavior

Three actual hosted sessions completed every screen, one per condition. All
official condition verifications report matched. Independent export audit checks:

- 3 submissions; 24 raw trials; 12 ratings with nonblank explanations.
- 21 readable Responses CSV rows; filter `trial_role == response` for the 12 ratings.
- 3 Demographics CSV rows. Ordinary, Other-text and blank optional forms match raw.
- Exact condition passages, four statements, image paths, scale labels, measures,
  question positions and explanation strings match the frozen native materials.
- Three different question orders were observed and preserved in the saved data.
- Control reload after two responses preserved the next question and eight unique
  screen records. Completed reload reported already saved and did not add a save.
- The readable export recipe retains all detected fields and is confirmed.

Local tests cover every condition and all 24 question permutations, Virdex-only
assignment, exact four-response completion, explanation gating, authoritative
Console assignment, partial reload, failed-save retry, duplicate Sandbox guard,
and offline dependencies. They also passed against the actual converted package.
The official converter made one expected reviewer URL-condition reader change;
the staging script verifies that exact change and no others. No frozen manifest
was edited by hand.

Recheck the exact bundle:
`python3 tools/validate_virdex_sandbox.py /path/to/sandbox-data.zip`.
The synthetic-only summary is `VIRDEX_PILOT_SANDBOX_VERIFICATION.json`. Raw exports
and browser evidence remain in ignored `data/private/2026-11-03/virdex-pilot/`.

## Analysis fields

Filter `trial_role == response`. Use `condition` (also preserved as
`benefit_condition` and `launch_condition`), `measure`, `rating`, and `explanation`.
The four measure IDs are `ought_to_have`, `best_to_have`, `wrongness`, and
`special_importance`; question IDs prepend `virdex_`. Both `item_id` and
`selected_animal_id` are `virdex`. Each participant contributes four responses in
one condition. Demographics are exported separately.

## Remaining steps for David

1. Add this pilot's actual Prolific completion URL in Setup & launch.
2. Copy the Console's single production link into Prolific, enter **75** places,
   and select the matching completion code. Confirm those actual settings in Console.
3. Rerun final preflight and verify the completion redirect before going Live.

The completion URL remains blank and Prolific-configured confirmation unchecked.
Earlier studies, recruitment targets and participant datasets are unchanged.
Sandbox testing does not consume any of this pilot's 75 production places.
