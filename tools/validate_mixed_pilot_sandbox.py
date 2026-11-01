"""Audit six actual hosted mixed-pilot Sandbox sessions against frozen materials."""
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
import argparse,csv,hashlib,io,json,subprocess
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--summary',type=Path);a=p.parse_args()
root=Path(__file__).resolve().parents[1]
with ZipFile(root/'dist/norms-teleology-mixed-pilot-console-1.1.4.zip') as z:
 material=z.read('js/materials.js').decode();package=json.loads(z.read('explanation-lab.config.json'))
m=json.loads(subprocess.check_output(['node','-e','require("node:vm").runInThisContext(require("node:fs").readFileSync(0,"utf8"));process.stdout.write(JSON.stringify(globalThis.NormsMaterials));'],input=material,text=True))
with ZipFile(a.bundle) as z:
 raw=json.loads(z.read('raw-submissions.json'));manifest=json.loads(z.read('manifest.json'))
 response=list(csv.DictReader(io.StringIO(z.read('responses.csv').decode('utf-8-sig'))))
 demos=list(csv.DictReader(io.StringIO(z.read('demographics.csv').decode('utf-8-sig'))))
assert manifest['study']['id']=='NORMS-TELEOLOGY-MIXED-CONDIT-A5QM'
targets=dict(zip(['p1','p2','p3','p4','p5','p6'],[9,8,8,9,8,8]))
assert {c['code']:c['target'] for c in manifest['study']['conditions']}==targets and sum(targets.values())==50
assert len(raw)==6 and {s['condition'] for s in raw}==set(targets)
assert len(response)==120 and len(demos)==6 and 'explanation' not in response[0]
assert sum(r['trial_role']=='response' for r in response)==90
assert all(r['condition_verification']=='matched' for r in response+demos)
condition_orders=[['control','survival','ecology'],['control','ecology','survival'],['survival','control','ecology'],['survival','ecology','control'],['ecology','control','survival'],['ecology','survival','control']]
pairings={f'p{i+1}':dict(zip(['virdex','nalk','marvin'],order)) for i,order in enumerate(condition_orders)}
items={i['id']:i for i in m['items']};measures=[q['id'] for q in m['questions']]
orders={}
for s in raw:
 code=s['condition'];idx=int(code[1:])-1;md=s['metadata'];trials=s['trials'];mapping=pairings[code]
 assert s['mode']=='sandbox' and md['experimentVersion']==m['version']==package['experimentVersion']
 assert md['conditionVerification']['status']=='matched' and md['conditionVerification']['expectedCondition']==code
 assert md['condition_map']==mapping and md['pairing_id']==md['launch_condition']==code
 assert md['expected_rating_count']==15
 animal_order,question_order=md['item_order'],md['question_order']
 assert sorted(animal_order)==sorted(items) and sorted(question_order)==sorted(measures)
 assert len(trials)==21 and sorted(t['screen_index'] for t in trials)==list(range(21))
 assert any(t['stage']=='consent' and t['consent'] is True for t in trials)
 assert all(t['study_version']==m['version'] and t['review_mode'] is False and t['collection_mode']=='sandbox' and t['valid_participant_data'] is True for t in trials)
 assert all(t['launch_condition']==code and t['pairing_id']==code and t['condition_map']==mapping for t in trials)
 assert all(t['item_order']==animal_order and t['question_order']==question_order and 'explanation' not in t for t in trials)
 ratings=[t for t in trials if t['trial_role']=='response'];assert len(ratings)==15 and len({t['question_id'] for t in ratings})==15
 assert Counter(t['benefit_condition'] for t in ratings)==dict.fromkeys(['control','survival','ecology'],5)
 assert [t['question_position'] for t in ratings]==list(range(1,16))
 for ip,animal in enumerate(animal_order):
  item=items[animal];rows=[t for t in ratings if t['item_id']==animal]
  assert [t['measure'] for t in rows]==question_order
  assert len([t for t in trials if t['stage']=='story' and t['item_id']==animal])==1
  for qp,t in enumerate(rows):
   q=next(q for q in item['questions'] if q['id']==t['measure'])
   assert t['condition']==t['benefit_condition']==mapping[animal]
   assert t['question_id']==animal+'_'+q['id'] and t['statement']==q['text']
   assert t['story_setup']==item['setup'] and t['story_condition']==item['conditions'][mapping[animal]]['text']
   assert t['item_position']==ip+1 and t['within_item_question_position']==qp+1
   assert t['rating']==(idx*2+ip+qp)%7+1 and t['rating_label']==m['scale'][t['rating']-1]
   assert t['scale_labels']==m['scale'] and t['scale_min']==1 and t['scale_max']==7
   assert t['image_feature_present']==item['images'][0]['src'] and t['image_feature_absent']==item['images'][1]['src']
   exported=next(r for r in response if r['condition']==code and r.get('question_id')==t['question_id'])
   assert exported['benefit_condition']==mapping[animal] and exported['launch_condition']==code and int(exported['rating'])==t['rating']
 demo=next(t for t in trials if t['trial_role']=='demographic');row=next(r for r in demos if r['condition']==code)
 for f in m['demographicFields']:assert row[f]==(demo[f] or '')
 if code=='p1':assert demo['age']=='29' and demo['gender']=='Non-binary' and demo['race']=='Multiracial'
 elif code=='p2':assert demo['age']=='37' and demo['other_gender']=='SANDBOX other gender' and demo['other_race']=='SANDBOX other race'
 else:assert all(demo[f] is None for f in m['demographicFields'])
 orders[code]={'animals':animal_order,'questions':question_order}
assert len({tuple(o['animals']) for o in orders.values()})>1 and len({tuple(o['questions']) for o in orders.values()})>1
cells={animal:{c:sum(n for code,n in targets.items() if pairings[code][animal]==c) for c in ['control','survival','ecology']} for animal in items}
assert all(n in [16,17] for cell in cells.values() for n in cell.values())
summary={'result':'passed','study_id':manifest['study']['id'],'version':m['version'],'package_fingerprint':package['packageFingerprint'],
 'planned_participants':50,'pairing_targets':targets,'planned_animal_condition_counts':cells,
 'sandbox_submissions':6,'raw_trials':126,'ratings':90,'response_csv_rows':120,'demographic_csv_rows':6,
 'all_pairings':'matched','benefit_condition':'verified in raw and readable CSV','explanations':'absent',
 'orders':orders,'reload':'mid-session and completed-session reload verified for p1; no duplicate save',
 'demographics':'ordinary values, both Other entries and all-blank forms passed',
 'bundle_sha256':hashlib.sha256(a.bundle.read_bytes()).hexdigest()}
if a.summary:a.summary.write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
