const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {webcrypto} = require('node:crypto');
const base=path.join(__dirname,'../code/experiments/mixed-pilot');
const ctx=vm.createContext({crypto:webcrypto});
vm.runInContext(fs.readFileSync(path.join(base,'js/materials.js'),'utf8'),ctx);
const m=JSON.parse(JSON.stringify(ctx.NormsMaterials));
const core=require(path.join(base,'js/core.js'));
function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(t=>[v,...t])):[[]];}
assert.equal(core.PAIRINGS.length,6);
assert.equal(new Set(core.PAIRINGS.map(p=>JSON.stringify(p.conditions))).size,6);
assert.equal(m.questions.find(q=>q.id==='value').text,'Virdexes with spots are valuable in a way that would be lost if virdexes stopped having spots.');
for(const item of m.items){assert.equal(item.questions.length,5);assert(item.questions.find(q=>q.id==='value').text.includes('valuable in a way that would be lost'));}
for(const pairing of core.PAIRINGS){
 assert.deepEqual(Object.keys(pairing.conditions),['virdex','nalk','marvin']);
 assert.deepEqual(Object.values(pairing.conditions).sort(),['control','ecology','survival']);
 for(const order of permutations(m.items.map(i=>i.id)))for(const qs of permutations(m.questions.map(q=>q.id))){
  const screens=core.screens(m.items,order,qs);
  assert.equal(screens.length,22);
  assert.deepEqual(screens.filter(s=>s.stage==='story').map(s=>s.item),order);
  assert.equal(new Set(screens.filter(s=>s.stage==='story').map(s=>pairing.conditions[s.item])).size,3);
  for(const item of m.items)assert.deepEqual(screens.filter(s=>s.stage==='rating'&&s.item===item.id).map(s=>item.questions[s.question].id),qs);
 }
}
function launch(seed){
 const elements=new Map(),records=[]; let timeline;
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',addEventListener(){}});return elements.get(id);};
 const store=new Map();if(seed)store.set(m.version+'-participant',JSON.stringify(seed));
 const context=vm.createContext({NORMS_REVIEW:false,URLSearchParams,URL,Uint32Array,crypto:webcrypto,performance,
  location:{search:'?pairing=p6&condition=control',href:'https://example.invalid/participant.html'},
  document:{getElementById:element},window:{scrollTo(){}},jsPsychHtmlButtonResponse:function(){},
  localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},
  initJsPsych:()=>({data:{get:()=>({push:r=>records.push(r),values:()=>records})},run:t=>{timeline=t;}})});
 for(const file of ['materials.js','config.js','core.js','study.js'])vm.runInContext(fs.readFileSync(path.join(base,'js',file),'utf8'),context);
 return{context,elements,records,store,timeline};
}
for(const p of core.PAIRINGS){
 const seed={version:m.version,session_id:'synthetic',pairing_id:p.id,condition_map:p.conditions,item_order:['marvin','virdex','nalk'],question_order:['value','wrongness','significance','survival_importance','comparative_importance'],consented:true,records:[],next:0,complete:false};
 const run=launch(seed);assert.equal(run.timeline.length,21);
 const answers=run.timeline.filter(t=>t.data.trial_role==='response');
 assert.equal(answers.length,15);
 for(const item of m.items){
  const rows=answers.filter(t=>t.data.item_id===item.id);
  assert(rows.every(t=>t.data.condition===p.conditions[item.id]));
  assert(rows.every(t=>!t.stimulus().includes('textarea')&&!t.stimulus().includes('Please explain')));
  assert(rows.every(t=>t.stimulus().includes(item.conditions[p.conditions[item.id]].text)));
  assert.deepEqual(Array.from(rows.map(t=>t.data.measure)),seed.question_order);
 }
 assert.deepEqual(Array.from(answers.map(t=>t.data.question_position)),Array.from({length:15},(_,i)=>i+1));
 assert(run.timeline.every(t=>t.data.valid_participant_data===false));
 const trials=run.timeline.map(t=>({...t.data,...(t.data.stage==='consent'?{consent:true}:{}),...(t.data.trial_role==='response'?{rating:4}:{})}));
 assert(core.complete(trials,core.expectedQuestions(m.items),p.conditions));
 assert(trials.every(t=>!('explanation' in t)));
 const missingRating=trials.map(t=>t.question_id==='nalk_value'?{...t,rating:null}:t);
 assert(!core.complete(missingRating,core.expectedQuestions(m.items),p.conditions));
 const incorrect=trials.map(t=>t.trial_role==='response'&&t.item_id==='marvin'?{...t,condition:'invalid'}:t);
 assert(!core.complete(incorrect,core.expectedQuestions(m.items),p.conditions));
 const resumed=launch({...seed,records:trials.slice(0,8),next:8});
 assert.equal(resumed.records.length,8);assert.equal(resumed.timeline[0].data.screen_index,8);
 assert.equal(resumed.context.normsStudy.pairing,p.id);
 assert.deepEqual(Array.from(resumed.context.normsStudy.state.question_order),seed.question_order);
 assert.deepEqual(Array.from(resumed.context.normsStudy.state.item_order),seed.item_order);
 const done=launch({...seed,records:trials,next:21,complete:true});
 assert(done.context.normsStudy.state.complete);assert(done.elements.get('jspsych-target').innerHTML.includes('completed the study'));
 const incomplete=launch({...seed,records:trials.filter(t=>t.question_id!=='nalk_value'),next:21,complete:true});
 assert(!incomplete.context.normsStudy.state.complete);
}
for(let i=0;i<30;i++){
 const fresh=launch(),state=fresh.context.normsStudy.state;
 assert(core.PAIRINGS.some(p=>p.id===state.pairing_id));
 assert(core.validOrder(Array.from(state.item_order),m.items));
 assert(core.validOrder(Array.from(state.question_order),m.questions));
}
for(const html of ['index.html','participant.html']){
 const text=fs.readFileSync(path.join(base,html),'utf8');assert(!text.includes('type="module"'));
 for(const [,file]of text.matchAll(/(?:src|href)="([^"]+)"/g)){assert(!/^https?:/.test(file));assert(fs.existsSync(path.join(base,file)));}
}
for(const item of m.items)for(const image of item.images)assert(fs.statSync(path.join(base,image.src)).size>10000);
console.log('Passed all 6 pairings × 6 animal orders × 120 question orders; real runtime passages, trial-level conditions, shared questions, reload, completion, updated value wording, rating-only completion and offline dependencies.');
