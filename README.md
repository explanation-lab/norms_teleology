# norms_teleology

## New mixed-condition pilot

[Offline reviewer ZIP](dist/norms-teleology-mixed-pilot-review-1.1.4.zip), version
`norms-teleology-mixed-pilot-1.1.4`. Extract and double-click `index.html`.
Each participant receives all three animals once and all three conditions once;
the six pairings, animal order and one shared question order are randomized.
Value wording is revised to “valuable in a way that would be lost”. Responses
are ratings only, without explanations. Marvins have one ground-contact spike
per hoof. The reviewer
panel selects pairings, animals and screens and shuffles preview orders.
[Design](code/experiments/mixed-pilot/STUDY_DESIGN.md). Checks:
`node tests/mixed-pilot.cjs`; package: `python3 tools/package_mixed_pilot.py`.
The separate hosted pilot targets **50 participants total**, balanced across six
pairings. All six Sandbox sessions and the 90-rating export audit passed.
[Console setup and final Prolific actions](docs/MIXED_PILOT_CONSOLE.md).
Use benefit_condition for control/survival/ecology in readable CSVs. Previous
hosted collections are unchanged.

## Study 1

Current source and review ZIP are version 2.1.0: Virdexes, Nalks and Marvins,
three between-participant conditions, and five agreement/explanation pairs per
animal (15 total). Animal order is randomized, with one condition held across
all animals. Significance is the added fifth measure. One randomized question order per
participant is reused for all three animals. Optional Purpose Norms
demographics remain at the end. Nalk hair and Marvin foot spikes are prominent;
Marvins have normal small feet and many spikes versus none.

- [Open the reviewer entry](code/experiments/study1/index.html). For a browser
  preview, use the ZIP or local HTML file rather than GitHub's source-code view.
- [Review ZIP](dist/norms-teleology-study1-review.zip): extract and double-click
  `index.html`; conditions and screens can be selected directly in the panel.
  All assets and jsPsych are bundled. No server or internet is required.
- [Console upload ZIP](dist/norms-teleology-study1-upload.zip): the separate
  collection source package.
- [Expanded frozen Console release](dist/norms-teleology-study1-console-2.1.0.zip): the native
  converted package actually deployed on GitHub Pages.
- [Study Console setup](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2&study=NORMS-TELEOLOGY-THREE-ANIMAL-UVMR&data=sandbox&section=setup):
  **25 per condition / 75 total**. All three hosted Sandbox groups passed.
- [Design and wording](code/experiments/study1/STUDY_DESIGN.md) and
  [image provenance and prompts](code/experiments/study1/assets/IMAGE_PROVENANCE.md).
- [Expanded Console setup and verification](docs/STUDY1_EXPANDED_CONSOLE.md).
- [Original collection record](docs/STUDY1_CONSOLE.md).

Rebuild packages with `python3 tools/package_study.py`. Run checks with
`node tests/study1.cjs`, `node tests/study1-save.cjs`, and
`python3 tests/check_packages.py`. For localhost preview, run
`python3 tools/serve.py --port 8776` and open `http://127.0.0.1:8776/`.

The repository is public with David's explicit approval. The original hosted
release remains frozen at 1.1.1; its Console study has 75 real submissions.
Version 2.1.0 is separately hosted and registered as Norms Teleology — Three
Animals with 25 per condition / 75 total. All three hosted Sandbox sessions and
the downloaded-data audit passed; only David's final Prolific setup remains.
Review data are never submitted. See the expanded Console setup record.

How do beliefs about the purposes of nonhuman animals shape judgments of goodness, value, and importance?

The project develops the normativity strand of the teleology work discussed by David Rose and Shaun Nichols in the October 9–12, 2026 “Projects for students” email thread. It builds on the lab’s ecological-purpose and animal-goodness work and on literature concerning teleological explanation, biological functions, and normative judgments.

## Starting questions

- **Individuals / good purposes:** Compare animals failing to fulfill an ecological purpose (e.g., bumblebees that never pollinate) with closely matched nonfunctional differences. Explore judgments of badness, value, and importance, including measures that do not rely exclusively on strong moral language.
- **Species / obsolescence:** Does a species seem less valuable or important when the ecological function it serves becomes obsolete?
- **Species / loss of uniqueness:** Does a species seem less valuable or important when other species now serve the same ecological function?

These are directions for developing candidate cases, not finalized experiments or established findings. Dhruv should review the background, propose study ideas, and develop closely matched controls before a design is chosen with David and Shaun.

## Team and current stage

Dhruv Sahu is the sole project member and Project Lead for now. David Rose and Shaun Nichols provide scientific guidance. Current stage: Study 1 has collected 75 real submissions; the expanded three-animal revision is hosted and Sandbox verified, awaiting Prolific setup. No backup has been assigned.

## Slides and readings

- [Preparation slides — Prepmaterial.pptx](https://docs.google.com/presentation/d/1hAYuEmqD8ggW-ICuPhchTQl99BpP1bOj/edit?usp=drivesdk&ouid=101954754178837148122&rtpof=true&sd=true): Shaun’s latest attachment, October 12, 2026 at 4:57 PM Eastern. Slide 2 is visible; original speaker notes are preserved.
- [Readings document — papers_for_dhruv.docx](https://docs.google.com/document/d/1VqyLMDCL6lG5STdk6gRiyZ3jVK6R5PG2/edit?usp=drivesdk&ouid=101954754178837148122&rtpof=true&sd=true): David’s October 12, 2026 reading list, approved by Shaun. Includes slide references and eight full-text links.
- [Shared project folder](https://drive.google.com/drive/folders/1vCPlkpd5BauYUIpJx2RwQ2ynN5ns8ffs)

The reading list covers Kelemen (1999), Schachner et al. (2017), Kelemen & Rosset (2009), Kelemen et al. (2013), Lewry et al. (2023), Foster-Hanson & Lombrozo (2022), and Lombrozo & Rehder (2012). Consult the document for exact titles and PDF/source links.

## Project workspaces

- [Lab Dashboard](https://explanation-lab-dashboard.web.app/#project/NORMS-TELEOLOGY-S6P2/overview)
- [Study Console](https://explanation-lab-studies.web.app/?view=projects&project=NORMS-TELEOLOGY-S6P2)
- [Slack — #proj-norms-teleology](https://explanationlab.slack.com/archives/C0C8MLADFM4)
- [Google Drive](https://drive.google.com/drive/folders/1vCPlkpd5BauYUIpJx2RwQ2ynN5ns8ffs)

## Repository structure

`code/R/` is available for analyses and figures; `code/experiments/` for study implementations and materials; `data/` for appropriately de-identified analysis data; `docs/` for browser-renderable experiments or generated output; and `figures/` for research figures. Study 1 now lives in `code/experiments/study1/`; its downloadable packages are in `dist/`. No participant data, analyses, or preregistration have been created.

Keep participant-identifiable data and credentials outside this repository. Record active work, ownership, and open decisions in [PROJECT_STATUS.md](PROJECT_STATUS.md).
