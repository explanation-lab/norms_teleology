"""Audit an actual Console Sandbox export against this study's source materials."""
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
import argparse
import csv
import hashlib
import io
import json
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('bundle', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
materials = json.loads(subprocess.check_output([
    'node', '-e', 'require(process.argv[1]);process.stdout.write(JSON.stringify(globalThis.NormsMaterials));',
    str(root / 'code/experiments/study1/js/materials.js')
], text=True))
expected_ratings = {'control': [4, 2, 3, 1], 'survival': [7, 6, 5, 1], 'ecology': [6, 5, 7, 2]}
with ZipFile(args.bundle) as archive:
    raw = json.loads(archive.read('raw-submissions.json'))
    manifest = json.loads(archive.read('manifest.json'))
    responses = list(csv.DictReader(io.StringIO(archive.read('responses.csv').decode('utf-8-sig'))))
    demographics = list(csv.DictReader(io.StringIO(archive.read('demographics.csv').decode('utf-8-sig'))))
assert len(raw) == 3 and {s['condition'] for s in raw} == set(expected_ratings)
assert {c['code']: c['target'] for c in manifest['study']['conditions']} == dict.fromkeys(expected_ratings, 25)
assert len(responses) == 21 and len(demographics) == 3
assert sum(r['trial_role'] == 'response' for r in responses) == 12
assert all(row['condition_verification'] == 'matched' for row in responses + demographics)
assert manifest['study']['demographicFields'] == materials['demographicFields']
for submission in raw:
    condition = submission['condition']
    assert submission['mode'] == 'sandbox'
    assert submission['participant']['prolificPid'] == 'SANDBOX-' + condition.upper()
    assert submission['metadata']['experimentVersion'] == materials['version']
    assert submission['metadata']['conditionVerification']['status'] == 'matched'
    trials = submission['trials']
    assert len(trials) == 8
    assert sorted(t['screen_index'] for t in trials) == list(range(8)), 'Missing or duplicate screens after reload'
    assert all(t['condition'] == condition and t['review_mode'] is False and t['study_version'] == materials['version'] for t in trials)
    assert any(t['stage'] == 'consent' and t['consent'] is True for t in trials)
    ratings = [t for t in trials if t['trial_role'] == 'response']
    assert [t['rating'] for t in ratings] == expected_ratings[condition]
    for i, trial in enumerate(ratings):
        question = materials['questions'][i]
        assert trial['question_id'] == trial['measure'] == trial['item_id'] == question['id']
        assert trial['statement'] == question['text'] and trial['question_position'] == i + 1
        assert trial['story_setup'] == materials['setup']
        assert trial['story_condition'] == materials['conditions'][condition]['text']
        assert trial['scale_labels'] == materials['scale'] and trial['scale_min'] == 1 and trial['scale_max'] == 7
        assert trial['rating_label'] == materials['scale'][trial['rating'] - 1]
        assert trial['explanation'].startswith(f'SANDBOX {condition} Q{i+1}:')
        assert trial['rt'] >= 0 and trial['rating_rt'] >= 0
    demo = next(t for t in trials if t['trial_role'] == 'demographic')
    row = next(r for r in demographics if r['condition'] == condition)
    for field in materials['demographicFields']:
        assert row[field] == (demo[field] or '')
    if condition == 'ecology':
        assert all(demo[field] is None for field in materials['demographicFields'])
    elif condition == 'survival':
        assert demo['other_gender'] == 'SANDBOX other gender' and demo['other_race'] == 'SANDBOX other race'
    else:
        assert demo['age'] == '29' and demo['gender'] == 'Non-binary' and demo['race'] == 'Multiracial'
print(json.dumps({
    'result': 'passed', 'study_id': manifest['study']['id'], 'experiment_version': materials['version'],
    'conditions': expected_ratings, 'targets': dict.fromkeys(expected_ratings, 25),
    'submissions': len(raw), 'raw_trials': sum(len(s['trials']) for s in raw),
    'rating_rows': 12, 'response_csv_rows': len(responses), 'demographic_rows': len(demographics),
    'condition_checks': 'all matched', 'control_reload': 'all eight screens preserved exactly once',
    'optional_demographics': 'all blank ecology session saved successfully',
    'other_demographics': 'both survival Other entries preserved',
    'bundle_sha256': hashlib.sha256(args.bundle.read_bytes()).hexdigest()
}, indent=2))
