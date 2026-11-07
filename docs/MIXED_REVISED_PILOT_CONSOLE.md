# Revised mixed pilot Console setup

Sandbox verification completed November 7, 2026. Ready for David to add the
actual Prolific completion URL and confirm the real recruitment settings.

- Study: Norms Teleology — Revised Mixed Pilot.
- Study ID: `NORMS-TELEOLOGY-REVISED-MIXE-8ES4`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-REVISED-MIXE-8ES4&data=sandbox&section=setup).
- David selected **50 participants total**. Every participant sees all three
  animals and all three benefit conditions, each exactly once, giving 50 case
  observations per benefit condition and 15 ratings per participant.
- Hosted runtime: https://explanation-lab.github.io/norms_teleology/mixed-revised-pilot/
- Version: `norms-teleology-mixed-revised-pilot-1.0.3`; client 1.5.1;
  jsPsych 7.3.4; schema 2.0.0; counterbalanced within participant.
- Frozen native ZIP: `dist/norms-teleology-mixed-revised-pilot-console-1.0.3.zip`.
- Fingerprint: `82d9b514c0727667da5b60aa4110197eeecc48b77485bfa9d6c8614677f577c5`.
- Pages commit: `de071ebb96aa901a4c821c2dfb9dfc28039c5904`.
  Deployment run 42378524692 completed successfully. Only the new
  `mixed-revised-pilot/` runtime folder was added; earlier collections are frozen.

## Assignment and targets

| Code | Virdex | Nalk | Marvin | Target |
|---|---|---|---|---:|
| p1 | Control | Survival | Ecology | 9 |
| p2 | Control | Ecology | Survival | 8 |
| p3 | Survival | Control | Ecology | 8 |
| p4 | Survival | Ecology | Control | 9 |
| p5 | Ecology | Control | Survival | 8 |
| p6 | Ecology | Survival | Control | 8 |

Each animal appears in each benefit condition 16–17 times at the planned total.
The Console balances pairings through one link. Animal order is randomized
independently; one randomized question order is shared across the three animals.
The study uses the approved revised cases, darker Marvin hoof spikes, five new
statements, shortened hair/spike wording, the same seven-point agreement scale,
and no explanation questions. Consent, concise instructions, and optional
final demographics follow the approved reviewer.

## Sandbox verification

Six actual hosted browser sessions completed every screen. All six Console
condition checks report matched. The downloaded bundle audit verified:

- Six submissions, 126 unique raw trials, 90 valid ratings, 120 Responses CSV
  rows, and six demographic rows. No explanation fields.
- Exact cases, statements, image paths, scales, positions, and both randomized
  orders against immutable native materials. All 90 synthetic selected ratings
  match both raw records and readable CSV.
- Every animal–benefit pair occurs twice across the six tests.
- Shared question order within each participant; animal and question orders vary
  across sessions.
- Mid-session p1 reload resumes at the correct next question. Completed reload
  reports already saved; there are still exactly six saves.
- Ordinary demographics, both Other text entries, and entirely blank optional
  forms agree between raw records and demographics CSV.
- Source and native runtime tests passed: six pairings × six animal orders ×
  120 question orders; required ratings; reload; authoritative Console assignment;
  save retry and incomplete-save rejection; duplicate Sandbox protection.
- Native staging verifies runtime source equality. No frozen manifest was edited.

The readable export format is confirmed with all detected fields retained.
Filter `trial_role == response` for ratings. **Use `benefit_condition` for
control/survival/ecology**: the CSV's protected `condition` is the p1–p6 pairing
code. `item_id` identifies animal and `measure` identifies question.

Audit summary: `MIXED_REVISED_PILOT_SANDBOX_VERIFICATION.json`.
Recheck the private downloaded bundle with:

```
python3 tools/validate_mixed_pilot_sandbox.py /path/to/sandbox_data.zip --package dist/norms-teleology-mixed-revised-pilot-console-1.0.3.zip --study-id NORMS-TELEOLOGY-REVISED-MIXE-8ES4
```

## Final Prolific actions

Final Console preflight leaves exactly two actions:

1. Add this pilot's actual Prolific completion URL.
2. Paste the Console's single production link into Prolific, enter **50 places**,
   select its matching completion code, and confirm those settings in Console.

Then rerun preflight and verify the actual redirect before going Live. The
completion URL is blank and Prolific-configured box unchecked. Recruitment has
not started: zero production submissions and six Sandbox submissions. Tests do
not consume the 50 production places. Provisional consent duration is five minutes.
