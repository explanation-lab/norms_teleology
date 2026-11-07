# Mixed-condition pilot

Approved November 1, 2026. Each participant receives exactly three cases:
Virdexes, Nalks and Marvins, with a different condition assigned to each animal.
The three assigned conditions are control, survival benefit and ecological
benefit, each occurring once. The hosted Console balances assignment across the six bijections. Local
previews sample them uniformly.
Animal presentation order is independently randomized. One question permutation
is drawn per participant and reused for every animal. There are 15 total
agreement ratings, with the usual optional demographics at the end.

Value statements:

- Virdexes with spots are valuable in a way that would be lost if virdexes stopped having spots.
- Nalks with dense hair along their fins are valuable in a way that would be lost if nalks stopped having dense hair along their fins.
- Marvins with spikes on their hooves are valuable in a way that would be lost if marvins stopped having spikes on their hooves.

Version 1.1.0 removes every written explanation prompt and its reviewer control.
A selected valid rating alone enables Continue. The matched Marvin pair now
shows one larger spike at the ground-contact edge of each hoof versus ordinary
hooves with no spike. The case states that the spikes pierce pods as marvins walk.
The participant animal and question orders, scale labels, concise instructions,
consent and optional demographics are retained. Duration is estimated at 5 minutes. Each animal's correct condition passage
stays above its questions. Benefit-condition names appear in the reviewer panel,
not in the participant flow. Version-separated browser storage preserves pairing
and both orders across reload. Trial-level condition records the animal's actual
condition; general screens have null condition. Each trial also records the
pairing and full condition map. Completion requires a valid rating
for all 15 distinct animal/measure combinations with the expected conditions.

The reviewer can choose all six pairings, jump by animal or screen and shuffle
orders. It starts with canonical display orders for predictable inspection.
The participant preview randomizes all three assignments independently.
The frozen hosted release is separate from both existing collections, under
/mixed-pilot/. Study NORMS-TELEOLOGY-MIXED-CONDIT-A5QM targets 50 participants,
with pairing targets 9,8,8,9,8,8. Each animal appears in each condition 16–17 times.
All six hosted Sandbox sessions and their exported 90 ratings passed audit.
The reviewer ZIP remains offline. The hosted version requires a Console link;
launch_condition records the assigned pairing and benefit_condition records
control/survival/ecology for analysis. Only David's Prolific setup remains.
