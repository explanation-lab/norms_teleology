# norms_teleology

## Study 1 review build

Study 1 implements David's October 31, 2026 approved revision of `Study 1.docx`:
one fictional species, three between-participant conditions (control, survival
benefit, ecological benefit), and four agreement ratings with explanations.

- [Open the reviewer entry](code/experiments/study1/index.html). For a browser
  preview, use the ZIP or local HTML file rather than GitHub's source-code view.
- [Review ZIP](dist/norms-teleology-study1-review.zip): extract and double-click
  `index.html`; conditions and screens can be selected directly in the panel.
  All assets and jsPsych are bundled. No server or internet is required.
- [Console upload ZIP](dist/norms-teleology-study1-upload.zip): the separate
  collection entry, official client and configuration for hosting/registration.
- [Design and wording](code/experiments/study1/STUDY_DESIGN.md) and
  [image provenance and prompts](code/experiments/study1/assets/IMAGE_PROVENANCE.md).
- [Console setup status](docs/STUDY1_CONSOLE.md).

Rebuild packages with `python3 tools/package_study.py`. Run checks with
`node tests/study1.cjs`, `node tests/study1-save.cjs`, and
`python3 tests/check_packages.py`. For localhost preview, run
`python3 tools/serve.py --port 8776` and open `http://127.0.0.1:8776/`.

The repository remains private. No recruitment is launched. The existing
Dashboard resource links this repository to Dhruv's canonical project; the new
study awaits hosting and Console registration. Review data are never submitted.

How do beliefs about the purposes of nonhuman animals shape judgments of goodness, value, and importance?

The project develops the normativity strand of the teleology work discussed by David Rose and Shaun Nichols in the October 9–12, 2026 “Projects for students” email thread. It builds on the lab’s ecological-purpose and animal-goodness work and on literature concerning teleological explanation, biological functions, and normative judgments.

## Starting questions

- **Individuals / good purposes:** Compare animals failing to fulfill an ecological purpose (e.g., bumblebees that never pollinate) with closely matched nonfunctional differences. Explore judgments of badness, value, and importance, including measures that do not rely exclusively on strong moral language.
- **Species / obsolescence:** Does a species seem less valuable or important when the ecological function it serves becomes obsolete?
- **Species / loss of uniqueness:** Does a species seem less valuable or important when other species now serve the same ecological function?

These are directions for developing candidate cases, not finalized experiments or established findings. Dhruv should review the background, propose study ideas, and develop closely matched controls before a design is chosen with David and Shaun.

## Team and current stage

Dhruv Sahu is the sole project member and Project Lead for now. David Rose and Shaun Nichols provide scientific guidance. Current stage: literature review and study-material development. No backup has been assigned, and no study has been launched in this workspace.

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
