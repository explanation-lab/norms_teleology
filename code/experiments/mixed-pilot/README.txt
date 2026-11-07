NORMS TELEOLOGY — MIXED-CONDITION PILOT
Version: norms-teleology-mixed-pilot-1.1.4

REVIEW
Extract the entire ZIP, keep its folders together, then double-click index.html.
No installation, server, internet or sign-in is needed. JavaScript must be enabled.
The reviewer control panel lets you:
- Switch among all six animal-condition pairings.
- Jump to an animal, any question, consent, instructions, demographics or the end.
- Shuffle animal order or the shared question order (clears preview answers).
- Restore canonical review order or restart the selected pairing.
- Download local review answers, ratings or demographics.

Try participant flow opens participant.html without the reviewer panel. It draws
a random pairing, animal order and question order. After completing the preview,
Start another participant preview draws a new session from consent onward.

DESIGN
Every participant sees Virdexes, Nalks and Marvins once each, with exactly one
control story, one survival-benefit story and one ecological-benefit story.
The Console balances the six animal-condition pairings against saved targets.
Local participant previews draw a pairing randomly. Animal presentation order
is independently randomized. One random order of the five questions is reused
for all three animals. All assignments and both orders survive reloads.

Each animal has a story/image screen and five agreement ratings.
The value statement now reads, for example:
Virdexes with spots are valuable in a way that would be lost if virdexes stopped
having spots.
Nalk and Marvin statements use parallel wording for fin hair and hoof spikes.
All ratings use the same fully labeled seven-point agreement scale. Selecting
a rating enables Continue. There are no written explanation questions. The case and images stay above
each question. Consent, concise instructions and optional final demographics
match the prior study. The provisional duration is about 5 minutes.
Marvins now have one large ground-contact spike per hoof, pointing forward and
downward to pierce seed pods during ordinary walking, with matched plain hooves
in the no-spike image. Case, captions and questions consistently refer to hooves.

EXPORTS
JSON records pairing_id, condition_map, item_order, question_order and trials.
Local ratings CSV includes pairing_id, per-animal benefit_condition, item_id, measure and
question positions. Demographics appear once at the end and have a separate CSV.
All exports are marked review or local_preview, never real participant data.

RELEASE STATUS
This offline reviewer does not load a collection client or submit responses.
The separate hosted release is registered as NORMS-TELEOLOGY-MIXED-CONDIT-A5QM,
Norms Teleology — Mixed-Condition Pilot. Target: 50 participants total across
six pairings (9,8,8,9,8,8). Each person receives all three benefit conditions.
All six actual hosted Sandbox sessions passed; 90 ratings and 126 raw trials
were independently audited. Only the actual Prolific completion URL and
confirmation of Prolific settings remain. No new data collection has started.
Earlier hosted studies and datasets are unchanged. In the Console's readable
CSV, condition is the pairing code; use benefit_condition for control/survival/ecology.
