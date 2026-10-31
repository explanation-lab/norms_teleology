# Study 1 Console setup

Prepared October 31, 2026. Project: `NORMS-TELEOLOGY-S6P2`, led by Dhruv Sahu.
The existing project resource already points to the private repository
`explanation-lab/norms_teleology`; this was verified in the live Lab Dashboard.
No replacement repository or project was created.

Current build: `norms-teleology-study1-1.1.0`. At David's request, the standalone
feedback screen is replaced by Purpose Norms demographics: optional age, gender,
race, ethnicity and the Other text fields. Source, collection metadata, upload
configuration and exports all declare the six matching demographic fields.
Browser verification confirms the complete form can be left blank and submitted.

`dist/norms-teleology-study1-review.zip` is the self-contained reviewer package.
Its root `index.html` contains the reviewer panel and works with classic scripts
and local image files. No collection client is included in that ZIP. All local
records are labeled as review or local-preview data.

`dist/norms-teleology-study1-upload.zip` is the separate Console-connected package.
Its root `index.html` loads the frozen official client 1.5.1 and requires a real
Console launch. `review.html` offers the offline panel; `participant.html` offers
an unconnected participant-flow preview. All three conditions share the same
materials and study logic. The collection entry validates the assigned condition,
study version and condition list before displaying the study.

The live Console converter inspected a preliminary upload and reported Ready to
convert. We explicitly confirmed between-participant assignment, exactly
`control`, `survival`, `ecology`, version `norms-teleology-study1-1.0.0`, and no
demographics. It completed conversion, preserved the existing integration and
verified every condition reader uses the Console assignment. An extra `string`
candidate inferred by the heuristic was excluded from the confirmed mapping.

Final source subsequently received the demographics update and a completed-session reload correction and
regression tests: all restored records are reinserted into jsPsych before retrying
submission. `tools/package_study.py` builds the final ZIP and configuration with a
fresh deterministic source fingerprint and per-file SHA-256 manifest. The earlier
converter download and its obsolete fingerprint are not the final deliverable.

## Verification

- Source checks cover all three passages, four statements, consistent scale,
  local runtime assets, completion requirements, missing/duplicate answers and
  out-of-range ratings.
- Runtime checks cover all three Console assignments overriding URL conditions,
  completed-session reloads preserving all eight trial records/four responses,
  blocking incomplete completion, and retrying failed saves without data loss.
  They also verify that the demographic screen is visited, blank answers can
  finish, Other entries are saved, and collection metadata includes the fields.
- Browser checks over localhost cover condition switching at the same question,
  revised value wording, reviewer explanation preview, the full local participant
  flow, refusal, and resuming at question two after reload.
- Direct `file://` navigation is blocked by the app browser, so double-click
  compatibility is checked through self-contained ZIP paths and classic scripts;
  no direct file-browser test is claimed.

## Before data collection

The Console currently requires a published public study URL before it can create
the new study registration. No URL was invented, the repository was not made
public, and no production or live Sandbox responses were submitted. Publish the
upload folder through the lab's approved hosting workflow, then register that
address under the existing Norms Teleology project. Register all three launch
conditions with equal targets after total sample size is chosen. Confirm payment,
duration, protocol reference if needed, and the actual Prolific completion URL.
Run each real Sandbox condition and inspect its exported ratings and explanations
before recruitment. No study has been marked Ready or Live.
