# Vassel mixed pilot Console setup

Sandbox verification completed November 10, 2026. Ready for David to add the
actual Prolific completion URL and confirm the recruitment settings.

- Study: Norms Teleology — Vassel Mixed Pilot.
- Study ID: `NORMS-TELEOLOGY-VASSEL-MIXED-JDTA`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-VASSEL-MIXED-JDTA&data=sandbox&section=setup).
- User-selected target: **50 participants total**. Everyone receives all three
  animals and all three benefit conditions exactly once, giving 50 observations
  per benefit condition and 18 ratings per participant.
- Hosted collection: https://explanation-lab.github.io/norms_teleology/mixed-vassel-pilot/
- Version: `norms-teleology-mixed-vassel-pilot-1.0.1`; jsPsych 7.3.4;
  frozen client 1.5.1; schema 2.0.0; counterbalanced within participant.
- Frozen native ZIP: `dist/norms-teleology-mixed-vassel-pilot-console-1.0.1.zip`.
- Fingerprint: `2ef6bbf8c1874ecdf56b028f39d545252b690fcf530d6600a7ccaca0f7382a35`.
- Pages commit: `ff81287f9f97fece06405d7051a9fda017e573e6`.
  Deployment run 42814258933 succeeded. Only `mixed-vassel-pilot/` was added;
  earlier live versions and participant datasets are unchanged.

## Design and targets

| Code | Virdex | Nalk | Vassel | Target |
|---|---|---|---|---:|
| p1 | Control | Survival | Ecology | 9 |
| p2 | Control | Ecology | Survival | 8 |
| p3 | Survival | Control | Ecology | 8 |
| p4 | Survival | Ecology | Control | 9 |
| p5 | Ecology | Control | Survival | 8 |
| p6 | Ecology | Survival | Control | 8 |

This gives each animal 16–17 cases per benefit condition at the planned total.
The Console balances pairings using one production link. Animal order is
randomized independently, and one randomized six-question order is reused across
all three animals within each participant. Both orders survive reloads.

The six measures are ought_to_have, wrongness, special_importance, value,
meant_to_do, and reason_to_exist. Every response is a seven-point agreement
rating, without an explanation. Vassels replace Marvins; their cup-shaped shoulder
scales collect rainwater, benefiting either the individual Vassel or tree
salamanders. In control the collected water evaporates without significant effects.
The six survival/ecology passages use Shaun's standardized November 9 endings.
Consent, concise instructions, story-above-question layout and optional final
six-field demographics match the approved reviewer.

## Sandbox verification

Six actual hosted sessions completed all 24 recorded screens. All six official
Console condition-verification checks report matched. Independent bundle audit:

- Six submissions, 144 raw trial records, 108 ratings, 138 readable response rows,
  and six demographic rows. No explanation fields.
- Exact cases, all six statements per animal, scale labels, image paths, item and
  question positions, both randomized orders and per-animal benefit conditions
  match the frozen native materials.
- All 108 selected synthetic ratings agree with raw records and readable CSV.
  Every animal-condition combination occurs twice across the six tests.
- One shared question order per participant; animal and question orders vary
  between sessions.
- p1 reload after two ratings resumed at the next question. Completed reload
  reported already saved; the total remained six saves.
- Ordinary demographics, both Other text entries, and entirely blank optional
  forms match raw records and demographics CSV.
- Source and native tests passed all six pairings × six animal orders × 720
  question orders, plus rating gating, completion, reload, Console-authoritative
  pairing assignment, failed-save retry, incomplete-save rejection and duplicate
  Sandbox protection.
- All six frozen images exactly match the reviewer assets. Staging verifies
  runtime JavaScript source equality. No frozen manifest was edited by hand.

The readable CSV format is confirmed with all detected fields retained.
Filter `trial_role == response` for ratings. **Group by `benefit_condition` for
control/survival/ecology**: the CSV's protected `condition` is the p1–p6 Console
pairing. `item_id` identifies animal; `measure` identifies question.

Synthetic-only audit summary: `VASSEL_PILOT_SANDBOX_VERIFICATION.json`.
Recheck the private downloaded bundle:

```
python3 tools/validate_vassel_pilot_sandbox.py /path/to/sandbox-data.zip --study-id NORMS-TELEOLOGY-VASSEL-MIXED-JDTA
```

## Final Prolific steps

Final preflight leaves exactly two actions:

1. Add this pilot's actual Prolific completion URL in Setup & launch.
2. Paste the Console's single production link into Prolific, enter **50 places**,
   select the matching completion code, and confirm those real settings in Console.

Then rerun preflight and verify the actual redirect before going Live. The
completion URL is blank and Prolific-configured box unchecked. Study stage is
Sandbox testing, with zero production submissions and six test submissions.
Tests do not consume the 50 production places. Consent duration remains the
approved provisional five minutes.
