# Mixed-condition pilot Console setup

Ready for David to add the actual Prolific completion URL. Six real hosted
Sandbox sessions and the independent export audit passed November 1, 2026.
Final preflight leaves only the completion URL and confirmation of the actual
Prolific study link, 50 places and matching completion code. The pilot remains
in Sandbox testing with zero production submissions and six test submissions.

- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-MIXED-CONDIT-A5QM&data=sandbox&section=setup)
- Study: Norms Teleology — Mixed-Condition Pilot.
- Study ID: `NORMS-TELEOLOGY-MIXED-CONDIT-A5QM`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- User-selected total: **50 participants**. Everyone receives all three benefit
  conditions, so there are 50 case observations per benefit condition, with five
  ratings per case. This is not 50 participants in each of three separate groups.
- Hosted collection: https://explanation-lab.github.io/norms_teleology/mixed-pilot/
- Version: `norms-teleology-mixed-pilot-1.1.4`; jsPsych 7.3.4; client 1.5.1;
  schema 2.0.0; assignment type `counterbalanced_within_participant`.
- Frozen native release: `dist/norms-teleology-mixed-pilot-console-1.1.4.zip`.
- Fingerprint: `dd469a474218d5656d4f40b71531551d0d2ca6b941e645d56c5e2e9519d8f5e0`.
- Final Pages deployment: `7b1bf50` on `gh-pages`, only `mixed-pilot/` updated.

## Pairing targets

The Console assigns one of the six animal–condition pairings using its balanced
single link. Animal presentation order is then randomized independently, and one
random question order is reused for every animal for a given participant.

| Code | Virdex | Nalk | Marvin | Target |
|---|---|---|---|---:|
| p1 | Control | Survival | Ecology | 9 |
| p2 | Control | Ecology | Survival | 8 |
| p3 | Survival | Control | Ecology | 8 |
| p4 | Survival | Ecology | Control | 9 |
| p5 | Ecology | Control | Survival | 8 |
| p6 | Ecology | Survival | Control | 8 |

This gives each animal 16–17 presentations in each benefit condition at the
planned total of 50. Everyone sees every animal once and every condition once.

## Verified Sandbox behavior

Six actual browser sessions completed consent, the concise instructions, three
stories with the final images, 15 rating-only questions and optional demographics.
All six requested pairing codes matched the Console's condition verifier.

The downloaded bundle was audited against immutable native source:

- 6 submissions, 126 raw trials, 90 valid ratings, no explanation fields.
- 120 Responses CSV rows: filter `trial_role == response` for the 90 ratings.
- 6 demographics CSV rows. Ordinary responses, both Other entries, and all-blank
  forms were checked against raw records.
- Every animal–condition pair occurs twice across the six Sandbox participants.
- Exact cases, statements, image paths, scale labels, positions and both randomized
  orders match the final materials. Each participant's question order is shared
  across all three animals; both animal and question orders vary across sessions.
- p1 reload after two ratings preserved the next question and all 21 unique screens.
  A completed reload reported already saved; the count remained six.
- Client transport failure/retry, incomplete-save rejection, authoritative pairing
  assignment and order/condition launch aliases are covered by local runtime tests.

Recheck the exact test bundle:
`python3 tools/validate_mixed_pilot_sandbox.py /path/to/sandbox_data.zip`.
The synthetic-only summary is `MIXED_PILOT_SANDBOX_VERIFICATION.json`. Raw downloads
and the readiness screenshot stay in ignored `data/private/`.

## Analysis fields

The readable Responses CSV's protected `condition` is the Console's pairing code
p1–p6. **Use `benefit_condition` to group ratings by control, survival or ecology.**
`launch_condition` and `pairing_id` preserve the pairing code; `item_id` identifies
the animal and `measure` identifies the question. Raw trial `condition` also
contains the benefit condition. `condition_map`, `item_order`, `question_order`,
and overall/within-item question positions are retained. Every field was kept in
the confirmed readable export recipe. Final value wording and the single
hoof-spike images match the approved reviewer; there are no written explanations.

The Console converter's informational detected internal-cell list contains its
static-analysis tokens; the actual within-participant manipulation is defined
by the three-value `condition_map` and explicit `benefit_condition`, verified in
all six real exports. No frozen manifest was hand edited.

## Final steps for David

1. Add this pilot's actual Prolific completion URL in Setup & launch.
2. Copy the Console's single production link into Prolific, enter **50** places,
   and select the matching completion code. Confirm those real settings in Console.
3. Verify the actual redirect and rerun final preflight before going Live.

No completion URL was invented or copied from an earlier study, and the
Prolific-configured confirmation remains unchecked. Duration is provisionally
about five minutes. Earlier hosted studies and their participant data remain
unchanged. Sandbox submissions do not consume the 50 production places.
