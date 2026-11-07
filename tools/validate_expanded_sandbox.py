"""Audit the three hosted 2.1.0 Sandbox sessions against the frozen release."""
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
import argparse, csv, hashlib, io, json, subprocess

parser = argparse.ArgumentParser()
parser.add_argument('bundle', type=Path)
parser.add_argument('--summary', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
with ZipFile(root / 'dist/norms-teleology-study1-console-2.1.0.zip') as release:
    material_source = release.read('js/materials.js').decode()
    package = json.loads(release.read('explanation-lab.config.json'))
m = json.loads(subprocess.check_output(['node', '-e', 'require("node:vm").runInThisContext(require("node:fs").readFileSync(0,"utf8"));process.stdout.write(JSON.stringify(globalThis.NormsMaterials));'], input=material_source, text=True))
with ZipFile(args.bundle) as archive:
    raw = json.loads(archive.read('raw-submissions.json'))
    manifest = json.loads(archive.read('manifest.json'))
    responses = list(csv.DictReader(io.StringIO(archive.read('responses.csv').decode('utf-8-sig'))))
    demographics = list(csv.DictReader(io.StringIO(archive.read('demographics.csv').decode('utf-8-sig'))))
assert manifest['study']['id'] == 'NORMS-TELEOLOGY-THREE-ANIMAL-UVMR'
conditions = ['control', 'survival', 'ecology']
assert {c['code']: c['target'] for c in manifest['study']['conditions']} == dict.fromkeys(conditions, 25)
assert len(raw) == 3 and {s['condition'] for s in raw} == set(conditions)
assert len(responses) == 60 and len(demographics) == 3
assert sum(r['trial_role'] == 'response' for r in responses) == 45
assert all(row['condition_verification'] == 'matched' for row in responses + demographics)
assert manifest['study']['demographicFields'] == m['demographicFields']
expected_ratings = {'control': [1,3,4,6,7], 'survival': [2,4,5,6,7], 'ecology': [7,6,5,4,3]}
orders = {}
for submission in raw:
    condition = submission['condition']; metadata = submission['metadata']; trials = submission['trials']
    assert submission['mode'] == 'sandbox'
    assert metadata['experimentVersion'] == m['version'] == package['experimentVersion']
    assert metadata['conditionVerification']['status'] == 'matched'
    assert metadata['expected_rating_count'] == 15
    item_order, question_order = metadata['item_order'], metadata['question_order']
    assert sorted(item_order) == sorted(item['id'] for item in m['items'])
    assert sorted(question_order) == sorted(q['id'] for q in m['questions'])
    assert len(trials) == 21 and sorted(t['screen_index'] for t in trials) == list(range(21))
    assert all(t['condition'] == condition and t['review_mode'] is False and t['study_version'] == m['version'] and t['collection_mode'] == 'sandbox' for t in trials)
    assert all(t['item_order'] == item_order and t['question_order'] == question_order for t in trials)
    assert any(t['stage'] == 'consent' and t['consent'] is True for t in trials)
    ratings = [t for t in trials if t['trial_role'] == 'response']
    assert len(ratings) == 15 and len({t['question_id'] for t in ratings}) == 15
    assert [t['question_position'] for t in ratings] == list(range(1,16))
    assert Counter(t['item_id'] for t in ratings) == dict.fromkeys(item_order,5)
    for item_position, item_id in enumerate(item_order,1):
        item = next(item for item in m['items'] if item['id'] == item_id)
        rows = [t for t in ratings if t['item_id'] == item_id]
        assert [t['measure'] for t in rows] == question_order, 'Question order differs between animals'
        assert [t['within_item_question_position'] for t in rows] == list(range(1,6))
        assert [t['rating'] for t in rows] == expected_ratings[condition]
        story = [t for t in trials if t['stage'] == 'story' and t['item_id'] == item_id]
        assert len(story) == 1 and story[0]['item_position'] == item_position
        for position, trial in enumerate(rows,1):
            q = next(q for q in item['questions'] if q['id'] == trial['measure'])
            assert trial['question_id'] == item_id + '_' + q['id']
            assert trial['species'] == item_id and trial['item_position'] == item_position
            assert trial['statement'] == q['text'] and trial['probe'] == m['probe']
            assert trial['story_setup'] == item['setup'] and trial['story_condition'] == item['conditions'][condition]['text']
            assert trial['image_feature_present'] == item['images'][0]['src'] and trial['image_feature_absent'] == item['images'][1]['src']
            assert trial['scale_labels'] == m['scale'] and trial['scale_min'] == 1 and trial['scale_max'] == 7
            assert trial['rating_label'] == m['scale'][trial['rating']-1]
            assert trial['explanation'] == f'SANDBOX {condition} animal {item_position} question {position}: checking the final randomized study.'
    demo = next(t for t in trials if t['trial_role'] == 'demographic')
    row = next(r for r in demographics if r['condition'] == condition)
    for field in m['demographicFields']: assert row[field] == (demo[field] or '')
    if condition == 'ecology': assert all(demo[field] is None for field in m['demographicFields'])
    elif condition == 'survival': assert demo['other_gender'] == 'SANDBOX other gender' and demo['other_race'] == 'SANDBOX other race'
    else: assert demo['age'] == '29' and demo['gender'] == 'Non-binary' and demo['race'] == 'Multiracial'
    orders[condition] = {'animals': item_order, 'questions': question_order}
assert len({tuple(order['questions']) for order in orders.values()}) > 1
assert len({tuple(order['animals']) for order in orders.values()}) > 1
summary = {'result':'passed','study_id':manifest['study']['id'],'experiment_version':m['version'],
 'package_fingerprint':package['packageFingerprint'],'targets':dict.fromkeys(conditions,25),
 'submissions':3,'raw_trials':63,'rating_explanation_rows':45,'response_csv_rows':60,'demographic_rows':3,
 'orders':orders,'question_order':'same across all animals within participant; different across test participants',
 'control_reload':'all 21 unique screens preserved; completed reload did not resubmit',
 'demographics':'ordinary, both Other fields, and all-blank forms verified',
 'bundle_sha256':hashlib.sha256(args.bundle.read_bytes()).hexdigest()}
if args.summary: args.summary.write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
