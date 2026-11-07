# Expanded Study 1 Console setup

**Ready for David to add the Prolific completion URL.** All three actual hosted
Sandbox sessions and the independent downloaded-data audit passed October 31,
2026. Final preflight leaves only the completion URL and confirmation of the
actual Prolific link, 75 places and matching completion code. Collection has not
launched: zero real submissions, three Sandbox submissions.

- [Setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-THREE-ANIMAL-UVMR&data=sandbox&section=setup)
- Name: Norms Teleology — Three Animals.
- Study ID: `NORMS-TELEOLOGY-THREE-ANIMAL-UVMR`.
- Project: `NORMS-TELEOLOGY-S6P2`; owner Dhruv Sahu.
- Targets: **25 control / 25 survival benefit / 25 ecological benefit = 75**.
- Version: `norms-teleology-study1-2.1.0`, client 1.5.1, schema 2.0.0.
- Hosted collection: https://explanation-lab.github.io/norms_teleology/expanded/
- Frozen native converted package: `dist/norms-teleology-study1-console-2.1.0.zip`.
- Fingerprint: `087aa82136076409431a93f1f42b3731f545f5ef61f962221ebbcebdbe6542ca`.
- Pages deployment commit: `1e31c91e69db6a05a0afea1d3670fb06f791a14a`.

## Randomization and export verification

Each participant receives all three animals in a random order. A single random
permutation of the five measures is drawn for that participant and repeated for
every animal. The assigned condition stays constant across animals. Both orders
are saved for reload recovery and exported in metadata and each trial. Unit
checks cover all 120 possible question orders and all six animal orders.

Three actual hosted sessions completed consent, concise instructions, three
story/image screens, 15 rating/explanation pairs and optional demographics.
Control was reloaded after two ratings and resumed at the correct question;
completed reload did not produce another submission. Actual exports contain:

- 3 submissions, 63 raw trials, 45 complete rating/explanation pairs.
- 60 Responses CSV rows (filter `trial_role == response` for the 45 ratings).
- 3 demographics rows; ordinary values, both Other texts and all-blank answers
  verified against raw data.
- Exact case and question wording, images, seven-point labels, condition codes,
  item/measure IDs, positions and randomized orders all match frozen materials.
- Observed question orders differ across participants and match across all three
  animals within each participant. Animal orders also vary across participants.
- All three Console condition checks passed. Data format and demographic mapping
  confirmed after independent audit; all 53 detected response fields retained.

Recheck the exact Sandbox test bundle with:
`python3 tools/validate_expanded_sandbox.py /path/to/sandbox_data.zip`.
A synthetic-only summary is tracked in `STUDY1_EXPANDED_SANDBOX_VERIFICATION.json`.
Actual downloads and readiness screenshot are under ignored `data/private/`.

## Final Prolific actions

1. Add the actual Prolific completion URL in Setup & launch.
2. Copy the Console's single production link to Prolific, enter 75 places and
   select the matching completion code. Confirm those settings in the Console.
3. Check the actual completion redirect and rerun final preflight before launch.

No completion URL was invented or copied from the prior study. The configuration
confirmation remains unchecked because David will do the actual Prolific setup.
The 10–15 minute duration remains an estimate to check against recruitment terms.

The original study `NORMS-TELEOLOGY-STUDY-1-SYGT`, its 75 real submissions and
root hosted version 1.1.1 are unchanged. The new deployment adds only `expanded/`
on the Pages branch; no original runtime file changed. Use this new Console
study's link for the expanded design, not the old production link or bare URL.
