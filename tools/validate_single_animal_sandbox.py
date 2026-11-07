"""Audit the actual Console Sandbox export against the frozen participant release."""
from pathlib import Path
from zipfile import ZipFile
from collections import Counter
import argparse,csv,hashlib,io,json,subprocess
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--summary',type=Path);args=p.parse_args()
root=Path(__file__).resolve().parents[1]
with ZipFile(root/'dist/norms-teleology-single-animal-pilot-console-1.0.0.zip') as z:
 native=json.loads(z.read('explanation-lab.config.json'))
 script=z.read('js/materials.js').decode()
materials=json.loads(subprocess.check_output(['node','-e',script+';process.stdout.write(JSON.stringify(NormsMaterials));'],text=True))
items={i['id']:i for i in materials['items']};measures=[q['id'] for q in materials['questions']]
with ZipFile(args.bundle) as z:
 manifest=json.loads(z.read('manifest.json'));raw=json.loads(z.read('raw-submissions.json'))
 responses=list(csv.DictReader(io.StringIO(z.read('responses.csv').decode('utf-8-sig'))))
 demos=list(csv.DictReader(io.StringIO(z.read('demographics.csv').decode('utf-8-sig'))))
study=manifest['study'];version=native['experimentVersion']
assert manifest['mode']=='sandbox' and study['id']=='NORMS-TELEOLOGY-SINGLE-ANIMA-VSL7'
assert study['experimentVersion']==version and study['demographicFields']==materials['demographicFields']
assert {c['code']:c['target'] for c in study['conditions']}==dict.fromkeys(['control','survival','ecology'],25)
assert len(raw)==manifest['submissionCount']==6
assert len(responses)==manifest['responseRowCount']==48 and len(demos)==manifest['demographicRowCount']==6
assert len({s['participant']['prolificPid'] for s in raw})==6
conditions=Counter();animals=Counter();cells=Counter();orders=set();rating_count=0
for s in raw:
 c=s['condition'];md=s['metadata'];animal=md['selected_animal_id'];item=items[animal];conditions[c]+=1;animals[animal]+=1;cells[(c,animal)]+=1
 assert s['mode']=='sandbox' and s['studyId']==study['id'] and s['clientVersion']=='1.5.1'
 assert md['experimentVersion']==version and md['expected_rating_count']==5 and md['assignment_type']=='between_participant'
 assert md['conditionVerification']['status']=='matched' and md['conditionVerification']['observedConditions']==[c]
 assert md['condition']==md['launch_condition']==c and md['item_order']==[animal]
 order=md['question_order'];assert sorted(order)==sorted(measures);orders.add(tuple(order))
 trials=s['trials'];assert len(trials)==9 and sorted(t['screen_index'] for t in trials)==list(range(9))
 assert Counter(t['stage'] for t in trials)==Counter(consent=1,instructions=1,story=1,rating=5,demographics=1)
 assert next(t for t in trials if t['stage']=='consent')['consent'] is True
 for t in trials:
  assert t['selected_animal_id']==animal and t['item_order']==[animal] and t['question_order']==order
  assert t['condition']==t['launch_condition']==t['benefit_condition']==c
  assert t['study_version']==version and not t['review_mode'] and t['collection_mode']=='sandbox'
  assert t['animal_selection']=='uniform_random_independent_of_condition'
 ratings=sorted([t for t in trials if t['trial_role']=='response'],key=lambda t:t['question_position']);rating_count+=len(ratings)
 assert [t['measure'] for t in ratings]==order and len({t['question_id'] for t in ratings})==5
 for pos,t in enumerate(ratings,1):
  q=next(q for q in item['questions'] if q['id']==t['measure'])
  assert t['item_id']==t['species']==animal and t['item_position']==1
  assert t['question_id']==animal+'_'+q['id'] and t['question_position']==t['within_item_question_position']==pos
  assert t['statement']==q['text'] and t['story_setup']==item['setup'] and t['story_condition']==item['conditions'][c]['text']
  assert t['image_feature_present']==item['images'][0]['src'] and t['image_feature_absent']==item['images'][1]['src']
  assert t['scale_min']==1 and t['scale_max']==7 and t['scale_labels']==materials['scale']
  assert t['rating']==pos+1 and t['rating_label']==materials['scale'][t['rating']-1]
  assert t['explanation']=='Synthetic Sandbox '+c+' explanation '+str(pos)+': '+t['statement']
 csv_r=[r for r in responses if r['submission_id']==s['id'] and r['trial_role']=='response']
 assert len(csv_r)==5
 for t in ratings:
  r=next(r for r in csv_r if r['question_id']==t['question_id'])
  for field in ['selected_animal_id','item_id','measure','statement','explanation','rating_label','condition','benefit_condition','launch_condition']:
   assert r[field]==str(t[field]),field
  assert int(r['rating'])==t['rating'] and r['condition_verification']=='matched'
 demo=next(t for t in trials if t['stage']=='demographics');csv_d=next(r for r in demos if r['submission_id']==s['id'])
 for field in materials['demographicFields']:assert csv_d[field]==str(demo[field] or '')
 pid=s['participant']['prolificPid']
 if pid=='SANDBOX-CONTROL':assert {f:demo[f] for f in materials['demographicFields']}==dict(age='34',gender='Female',other_gender=None,race='Asian',other_race=None,ethnicity='Hispanic')
 elif pid=='SANDBOX-SURVIVAL':assert {f:demo[f] for f in materials['demographicFields']}==dict(age='42',gender='other_gender',other_gender='Synthetic gender',race='other_race',other_race='Synthetic race',ethnicity='Non-Hispanic')
 else:assert all(demo[f] is None for f in materials['demographicFields'])
assert conditions==dict.fromkeys(['control','survival','ecology'],2)
assert set(animals)==set(items) and len(orders)>1 and rating_count==30
assert all(len({a for c2,a in cells if c2==c})>1 for c in conditions)
summary={'status':'passed','study_id':study['id'],'experiment_version':version,'package_fingerprint':native['packageFingerprint'],'bundle_sha256':hashlib.sha256(args.bundle.read_bytes()).hexdigest(),'submissions':len(raw),'raw_trials':sum(len(s['trials']) for s in raw),'ratings_with_explanations':rating_count,'response_csv_rows':len(responses),'demographic_csv_rows':len(demos),'condition_counts':dict(conditions),'animal_counts':dict(animals),'condition_animal_counts':{c+'/'+a:n for (c,a),n in sorted(cells.items())},'distinct_question_orders':len(orders),'targets':{c['code']:c['target'] for c in study['conditions']},'data_recipe_confirmed':study['dataRecipeConfirmed'],'checks':['One condition and one animal per participant','All five distinct questions, valid ratings and exact explanations','Exact frozen stories, statements, images and scale labels','Animal assignment varies within every condition','All three species observed','Randomized question orders preserved in saved records','Consent and nine unique screens including reload recovery','Ordinary, Other-text and blank demographics match raw and CSV','Readable rating CSV matches raw records','Zero duplicate Sandbox submissions after completed reload']}
if args.summary:args.summary.parent.mkdir(parents=True,exist_ok=True);args.summary.write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
