# Project status

- Last updated: October 31, 2026.
- Current stage: Study 1 hosted and Sandbox verified; awaiting David's final Prolific setup.
- Project Lead and sole project member: Dhruv Sahu (ds2534@cornell.edu; GitHub ds2534).
- Project Backup: none assigned; sole-member project for now.
- Scientific guidance: David Rose and Shaun Nichols.
- Active experiment: Study 1, a single virdex species in control, survival-benefit, and ecological-benefit conditions.

## Study 1 implementation

David approved the design on October 31, 2026 and requested an offline reviewer
panel and ZIP. Source is in `code/experiments/study1/`; review and collection-upload
packages are in `dist/`. The matched creature images, four consistent agreement
ratings and subsequent explanations, consent and instructions are implemented.
The reviewer can switch conditions and jump to every screen without answering.
Version 1.1.0 replaces the standalone feedback screen with the optional Purpose
Norms demographic form and includes the demographic fields in local and Console
exports. The concise instructions requested by David are retained.

Shaun approved the study for Console setup. David requested 25 participants per
condition (75 total) and explicitly approved making the repository public for
GitHub Pages. Study `NORMS-TELEOLOGY-STUDY-1-SYGT` is registered under the existing
project. All three hosted Sandbox conditions and the exported ratings and
demographics passed. Current frozen release is `norms-teleology-study1-1.1.1`.
See [setup and verification](docs/STUDY1_CONSOLE.md). No recruitment is launched.

## Current work and next actions

1. David adds the actual Prolific completion URL in Setup & launch.
2. David configures the production study link, 75 places and matching completion code in Prolific, then confirms those settings in the Console.
3. Recheck the real completion redirect and final preflight before Ready/Live and collection.
4. Continue the literature review and other project strands using the preparation slides and readings in [Google Drive](https://drive.google.com/drive/folders/1vCPlkpd5BauYUIpJx2RwQ2ynN5ns8ffs).

Study 1 is technically verified. Prolific setup and launch remain with David.

## Access and working locations

- [Lab Dashboard](https://explanation-lab-dashboard.web.app/#project/NORMS-TELEOLOGY-S6P2/overview) — Dhruv is the sole member and Project Lead.
- [Study Console](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-STUDY-1-SYGT&data=sandbox&section=setup) — three groups passed; final Prolific setup pending.
- [Slack channel](https://explanationlab.slack.com/archives/C0C8MLADFM4) — private #proj-norms-teleology with Dhruv.
- GitHub — public with David's explicit approval; Dhruv retains write access. GitHub Pages publishes the frozen collection branch.
- [Drive folder](https://drive.google.com/drive/folders/1vCPlkpd5BauYUIpJx2RwQ2ynN5ns8ffs) — owned by Cornell Explanation Lab; original slides and reading document.

## Open decisions

Study 1's creature, manipulations, measures and adult target audience are approved.
Total sample size is 75, with 25 per condition. Hosting and Sandbox checks are
complete. Recruitment terms, deadline and future backup assignment remain open.
The five-minute duration is a pilot estimate to match the recruitment listing.

## Resume / handoff

Start with [README.md](README.md), then the slides and readings. Use main for the initial research brief; create appropriate branches for developing study code. Record new decisions and materials here as work progresses. No study results or Friday checkpoint are recorded yet.
