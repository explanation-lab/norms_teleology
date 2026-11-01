"""Stage only the mixed-pilot participant runtime from an immutable native ZIP."""
from pathlib import Path
from zipfile import ZipFile
import argparse,json,hashlib
parser=argparse.ArgumentParser();parser.add_argument('zip_path',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
base=['index.html','explanation-lab-client.js','explanation-lab.config.json','css/study.css','js/collection.js','js/config.js','js/core.js','js/materials.js','js/study.js','vendor/THIRD_PARTY_NOTICES.md','vendor/jspsych-7.3.4.css','vendor/jspsych-7.3.4.js','vendor/plugin-html-button-response-1.1.3.js']
images=['virdex-spotted.png','virdex-unspotted.png','nalk-prominent-hair.png','nalk-hairless.png','marvin-hoof-spikes.png','marvin-hooves-no-spikes.png']
allowed=base+['assets/'+i for i in images]
source=Path(__file__).resolve().parents[1]/'code/experiments/mixed-pilot'
with ZipFile(args.zip_path) as z:
 m=json.loads(z.read('explanation-lab.config.json'))
 assert m['assignmentType']=='counterbalanced_within_participant' and m['conditions']==['p1','p2','p3','p4','p5','p6']
 assert m['demographicFields']==['age','gender','other_gender','race','other_race','ethnicity']
 for n in ['js/study.js','js/materials.js','js/core.js','js/collection.js']:assert z.read(n)==(source/n).read_bytes(),n
 for n in allowed:
  p=args.output/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))
 (args.output/'.nojekyll').write_text('')
 print(json.dumps({'version':m['experimentVersion'],'fingerprint':m['packageFingerprint'],'output':str(args.output),'files':{n:hashlib.sha256((args.output/n).read_bytes()).hexdigest() for n in allowed}},indent=2))
