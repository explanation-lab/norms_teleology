# Study 1 Console setup

Study 1 is published and registered under Dhruv Sahu's Norms Teleology project.
All three real hosted Sandbox sessions passed on October 31, 2026. The data
format is confirmed. Final preflight reports only the two Prolific actions below.
There are zero production submissions; recruitment has not launched.

- [Study setup and launch](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-STUDY-1-SYGT&data=sandbox&section=setup)
- Console study ID: `NORMS-TELEOLOGY-STUDY-1-SYGT`.
- Canonical project ID: `NORMS-TELEOLOGY-S6P2`.
- Hosted collection: https://explanation-lab.github.io/norms_teleology/
- Target: **75 participants**, exactly **25 control / 25 survival / 25 ecology**.
- Current stage: **Sandbox testing**, awaiting final Prolific setup.
- Version: `norms-teleology-study1-1.1.1`; jsPsych 7.3.4; official client 1.5.1;
  schema 2.0.0. Version 1.1.1 uses the Console's canonical `demographic` trial tag.
- Demographic fields: `age`, `gender`, `other_gender`, `race`, `other_race`, `ethnicity`.
- Frozen converter fingerprint: `51feccb88a5f2b1f2a7949fd838db07928fab69e31590674e87810c7f3b5226b`.

## Final actions for David

1. Add the actual Prolific completion URL in Setup & launch. No completion code
   or URL has been invented, copied from another study, or checked prematurely.
2. Configure the Console's single production study link in Prolific, enter **75**
   places, and choose the matching completion code. Then check the Prolific
   configuration confirmation and rerun **Check everything before launch**.
   Verify the real completion redirect before switching to Ready/Live and
   starting collection. The Prolific confirmation remains unchecked.

The production link assigns each participant to the group furthest below its
saved target. Do not distribute the bare hosted URL or a Sandbox link. Sandbox
counts are separate from the production allocation and do not consume the 75
planned places.

## Sandbox verification

One actual browser session was completed for each condition through consent,
David's concise instructions, the correct assigned story and both images, four
rating/explanation pairs, and demographics. The Console verified the exact
requested condition code in every submission.

The complete downloaded bundle was independently validated against source:

- 3 submissions, 24 raw trials, 12 rating/explanation rows.
- Responses CSV: 21 non-demographic rows, including consent/instructions/story;
  use `trial_role == response` for the 12 substantive observations.
- Demographics CSV: 3 rows with all six declared fields.
- Exact setup, ending, question text/order, scale labels, ratings, explanations,
  version, and assigned conditions match source and the synthetic test inputs.
- Control was reloaded after two ratings: all eight stable screen indices were
  exported exactly once. A completed reload showed already saved and left the
  submission count at three.
- Survival preserves both Other text entries; ecology saves successfully with
  every demographic item blank. Age, non-binary gender and multiracial responses
  were also verified.
- All condition checks, demographic mapping, data-format confirmation and balanced
  targets pass. The final preflight leaves only the two real Prolific actions.

Recheck a downloaded bundle with:
`python3 tools/validate_sandbox.py /path/to/sandbox_data.zip`.
Raw downloads stay outside Git; only a synthetic verification summary is tracked.

## Hosting and release provenance

David explicitly approved making the existing repository public so GitHub Pages
could be enabled on the lab's current plan. GitHub reauthentication was completed
by David. Project identity, membership, Slack and Drive permissions are unchanged.

GitHub Pages publishes only the frozen participant runtime on branch `gh-pages`,
root directory. The deployment commit is
`72937ae44eb669d06fd1c9ddadc7c67e0f28edbc`. It contains the index, scripts, CSS,
matched images, local vendor runtime/notices, official collection client and
unaltered native converter manifest. The published manifest was fetched and
verified identical to the staged release. The repository's other documents are
not part of the Pages site.

`dist/norms-teleology-study1-console-1.1.1.zip` is the immutable native Console
conversion used for deployment. The source upload ZIP remains a reproducible
input; rebuilding it does not replace the frozen deployed release. Stage the
release with `python3 tools/stage_collection.py CONVERTED.zip OUTPUT_DIRECTORY`.

The reviewer ZIP remains separate and offline: extract and open `index.html`.
Review responses never submit to the Console. Its panel switches conditions and
screens, including the optional Purpose Norms demographics.

The hosted study runs in the repository subfolder and loads its own frozen
collection client. External collection dependencies are the Firebase 12.16.0
app/auth/firestore/app-check modules at
`https://www.gstatic.com/firebasejs/12.16.0/`, the Explanation Lab Firebase project
`explanation-lab-studies`, and its App Check/reCAPTCHA service. Consent includes
Cornell IRB and hotline links. There is no second collection or analytics service.
The single submitAndRedirect call is awaited; failures offer retry and never
claim a successful save or redirect first.
