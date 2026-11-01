const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const base=process.env.NORMS_STUDY_SOURCE || path.join(__dirname,'../code/experiments/single-animal-pilot');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(base,'js/materials.js'),'utf8'),ctx);
const m=JSON.parse(JSON.stringify(ctx.NormsMaterials)), core=require(path.join(base,'js/core.js'));
function launch({condition,animal,seed,collection=false,fail=false,randomValues}={}){
 const elements=new Map(),records=[],store=new Map(),calls=[];let timeline;
 const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',hidden:true,disabled:id==='rating-continue',append(){},addEventListener(){}});return elements.get(id);};
 const radios=Array.from({length:7},(_,i)=>({value:String(i+1),checked:false}));
 const identity=JSON.stringify(['SYNTHETIC','sandbox','pid','study','session',condition]);
 const key=m.version+(collection?'-collection:'+identity:'-participant');if(seed)store.set(key,JSON.stringify(seed));
 const client={launch:{studyKey:'SYNTHETIC',mode:'sandbox',condition,participant:{prolificPid:'pid',studyId:'study',sessionId:'session'}},submitAndRedirect:async(data,options)=>{calls.push({records:data.values(),options});if(fail)throw new Error('Synthetic failure');}};
 const crypto=randomValues?{randomUUID:()=> 'synthetic',getRandomValues:a=>{a[0]=randomValues.shift()??0;return a;}}:webcrypto;
 const context=vm.createContext({NORMS_REVIEW:false,NORMS_COLLECTION:collection,EXPLANATION_LAB_CONDITION:condition,explanationLab:client,crypto,Uint32Array,performance,URL,URLSearchParams,
  location:{search:'?condition=ecology&animal=marvin'},document:{getElementById:el,querySelector:()=>radios.find(r=>r.checked),querySelectorAll:()=>radios},window:{scrollY:0,scrollTo(){}},requestAnimationFrame:f=>f(),console:{error(){}},jsPsychHtmlButtonResponse:function(){},
  localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},initJsPsych:()=>({data:{get:()=>({values:()=>records,push:r=>records.push(r)})},run:t=>{timeline=t;},finishTrial:data=>calls.push({finished:data})})});
 for(const file of ['materials.js','config.js','core.js','study.js'])vm.runInContext(fs.readFileSync(path.join(base,'js',file),'utf8'),context);
 return{context,elements,records,store,calls,timeline,radios,client};
}
(async()=>{
 // Deterministic independent random draws reach every condition/animal cell;
 // participant URL overrides cannot force the assignment.
 for(let c=0;c<3;c++)for(let a=0;a<3;a++){
  const run=launch({randomValues:[c,a,0,0,0,0]});
  assert.equal(run.context.normsStudy.condition,core.CONDITIONS[c]);
  assert.equal(run.context.normsStudy.selectedAnimal,core.ANIMALS[a]);
 }
 const permutations=a=>a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p])):[[]];
 for(const condition of core.CONDITIONS)for(const animal of core.ANIMALS){
  const item=m.items.find(i=>i.id===animal),expected=core.expectedQuestions([item]);
  for(const order of permutations(m.questions.map(q=>q.id))){
   const screens=core.screens([item],[animal],order);assert.equal(screens.length,10);
   assert.deepEqual(screens.filter(s=>s.stage==='rating').map(s=>item.questions[s.question].id),order);
  }
  const seed={version:m.version,session_id:'synthetic',condition,selected_animal_id:animal,item_order:[animal],question_order:['value','wrongness','significance','survival_importance','comparative_importance'],records:[],next:0,consented:true,complete:false};
  const run=launch({condition,seed,collection:true});assert.equal(run.timeline.length,9);
  const answers=run.timeline.filter(t=>t.data.trial_role==='response');assert.equal(answers.length,5);
  assert(run.timeline.every(t=>t.data.condition===condition&&t.data.launch_condition===condition&&t.data.selected_animal_id===animal));
  assert(answers.every(t=>t.data.item_id===animal&&t.data.assignment_type==='between_participant'));
  assert(answers.every(t=>t.stimulus().includes(item.conditions[condition].text)&&t.stimulus().includes('Please explain your answer.')));
  assert(answers[0].data.statement.includes('valuable in a way that would be lost'));
  assert.deepEqual(Array.from(answers.map(t=>t.data.measure)),seed.question_order);
  const rows=run.timeline.map(t=>({...t.data,...(t.data.stage==='consent'?{consent:true}:{}),...(t.data.trial_role==='response'?{rating:4,explanation:'A reason for my judgment.'}:{})}));
  const valid=()=>core.complete(rows,expected,{[animal]:condition});assert(valid());
  for(const change of [{explanation:''},{explanation:'   '},{rating:8},{condition:'invalid'},{item_id:'invalid'}]){
   const bad=rows.map(r=>r.question_id===animal+'_value'?{...r,...change}:r);assert(!core.complete(bad,expected,{[animal]:condition}));
  }
  assert(!core.complete([...rows,rows.find(r=>r.trial_role==='response')],expected,{[animal]:condition}));
  // UI gating: rating alone reveals explanation; blank text does not advance.
  answers[0].on_start();answers[0].on_load();
  assert(run.elements.get('rating-continue').disabled);
  run.radios[3].checked=true;run.radios[3].onchange();
  assert.equal(run.elements.get('explanation-section').hidden,false);
  assert(run.elements.get('rating-continue').disabled);
  run.elements.get('explanation').value='   ';run.elements.get('explanation').oninput();assert(run.elements.get('rating-continue').disabled);
  run.elements.get('explanation').value='  My explanation  ';run.elements.get('explanation').oninput();assert(!run.elements.get('rating-continue').disabled);
  run.elements.get('rating-continue').onclick();assert.equal(run.calls[0].finished.explanation,'My explanation');
  const full={...seed,records:rows,next:9,complete:true};
  const done=launch({condition,seed:full,collection:true});await new Promise(r=>setImmediate(r));
  assert.equal(done.calls.length,1);assert.equal(done.calls[0].records.length,9);assert.equal(done.calls[0].options.metadata.expected_rating_count,5);
  const saved=launch({condition,seed:{...full,saved:true},collection:true});await new Promise(r=>setImmediate(r));assert.equal(saved.calls.length,0);
  const missing=launch({condition,seed:{...full,records:rows.filter(r=>r.stage!=='demographics')},collection:true});await new Promise(r=>setImmediate(r));assert.equal(missing.calls.length,0);
  const partial=launch({condition,seed:{...seed,records:rows.slice(0,5),next:5},collection:true});assert.equal(partial.records.length,5);assert.equal(partial.timeline[0].data.screen_index,5);assert.equal(partial.context.normsStudy.selectedAnimal,animal);assert.deepEqual(Array.from(partial.context.normsStudy.state.question_order),seed.question_order);
  const retry=launch({condition,seed:full,collection:true,fail:true});await new Promise(r=>setImmediate(r));assert(retry.elements.get('jspsych-target').innerHTML.includes('not been saved yet'));retry.client.submitAndRedirect=async()=>{};await retry.elements.get('retry-save').onclick();assert(retry.context.normsStudy.state.saved);
 }
 assert.throws(()=>launch({condition:'p1',collection:true}),/Invalid Console condition/);
 for(const file of (process.env.NORMS_STUDY_SOURCE ? ['review.html','participant.html'] : ['index.html','participant.html'])){
  const html=fs.readFileSync(path.join(base,file),'utf8');assert(!html.includes('type="module"'));assert(!html.includes('review-pairing'));
  for(const[,ref]of html.matchAll(/(?:src|href)="([^"]+)"/g)){assert(!/^https?:/.test(ref));assert(fs.existsSync(path.join(base,ref)));}
 }
 for(const item of m.items)for(const image of item.images)assert(fs.statSync(path.join(base,image.src)).size>10000);
 console.log('Passed 9 condition/animal cells × 120 question permutations; independent random draws, single-animal flow, required explanation UI gating, exact five-response validation, authoritative Console assignment, reload, optional-demographics completion, save/retry and offline dependencies.');
})().catch(e=>{console.error(e);process.exitCode=1;});
