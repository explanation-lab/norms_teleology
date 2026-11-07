const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const source=path.join(__dirname,'../code/experiments/mixed-pilot/js');
const materialContext=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(source,'materials.js'),'utf8'),materialContext);
const m=JSON.parse(JSON.stringify(materialContext.NormsMaterials));
const core=require(path.join(source,'core.js'));
function launch(pairingId,{state,fail=false}={}){
 const elements=new Map(),records=[],store=new Map(),calls=[];let timeline;
 const identity=JSON.stringify(['SYNTHETIC-STUDY','sandbox','synthetic','study','session',pairingId]);
 if(state)store.set(m.version+'-collection:'+identity,JSON.stringify(state));
 const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',addEventListener(){}});return elements.get(id);};
 const client={launch:{studyKey:'SYNTHETIC-STUDY',mode:'sandbox',condition:pairingId,participant:{prolificPid:'synthetic',studyId:'study',sessionId:'session'}},submitAndRedirect:async(data,options)=>{calls.push({records:data.values().map(r=>({...r})),options});if(fail)throw new Error('synthetic transport failure');}};
 const context=vm.createContext({NORMS_REVIEW:false,NORMS_COLLECTION:true,EXPLANATION_LAB_CONDITION:pairingId,explanationLab:client,crypto:webcrypto,Uint32Array,performance,URL,URLSearchParams,
  location:{search:'?condition=p6&pairing=p6'},document:{getElementById:el},window:{scrollTo(){}},console:{error(){}},jsPsychHtmlButtonResponse:function(){},
  localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},initJsPsych:()=>({data:{get:()=>({values:()=>records,push:r=>records.push(r)})},run:t=>{timeline=t;}})});
 for(const file of ['materials.js','config.js','core.js','study.js'])vm.runInContext(fs.readFileSync(path.join(source,file),'utf8'),context);
 return{context,client,calls,records,elements,timeline};
}
(async()=>{
 for(const pairing of core.PAIRINGS){
  const fresh=launch(pairing.id);assert.equal(fresh.context.normsStudy.pairing,pairing.id);
  assert.equal(fresh.timeline.length,21);assert(fresh.timeline.every(t=>t.data.launch_condition===pairing.id&&t.data.valid_participant_data===true));
  const responses=fresh.timeline.filter(t=>t.data.trial_role==='response');assert.equal(responses.length,15);
  for(const r of responses){assert.equal(r.data.condition,pairing.conditions[r.data.item_id]);assert.equal(r.data.pairing_id,pairing.id);assert.equal(r.data.benefit_condition,pairing.conditions[r.data.item_id]);}
  const records=fresh.timeline.map(t=>({...t.data,...(t.data.stage==='consent'?{consent:true}:{}),...(t.data.trial_role==='response'?{rating:4}:{}),...(t.data.stage==='demographics'?Object.fromEntries(m.demographicFields.map(f=>[f,null])):{})}));
  const state={...JSON.parse(JSON.stringify(fresh.context.normsStudy.state)),consented:true,records,next:21,complete:true};
  const resumed=launch(pairing.id,{state});await new Promise(r=>setImmediate(r));assert.equal(resumed.calls.length,1);
  assert.equal(resumed.calls[0].records.length,21);assert.equal(resumed.calls[0].options.metadata.launch_condition,pairing.id);assert.equal(resumed.calls[0].options.metadata.expected_rating_count,15);
  assert(resumed.elements.get('jspsych-target').innerHTML.includes('Sandbox complete'));
  const wrong=launch(pairing.id,{state:{...state,records:records.map((r,i)=>i? r:{...r,launch_condition:'wrong'})}});await new Promise(r=>setImmediate(r));assert.equal(wrong.calls.length,0);
  const missing=launch(pairing.id,{state:{...state,records:records.filter(r=>r.stage!=='demographics')}});await new Promise(r=>setImmediate(r));assert.equal(missing.calls.length,0);
  const saved=launch(pairing.id,{state:{...state,saved:true}});await new Promise(r=>setImmediate(r));assert.equal(saved.calls.length,0);
  const partial=launch(pairing.id,{state:{...state,records:records.slice(0,8),next:8,complete:false}});assert.equal(partial.records.length,8);assert.equal(partial.timeline[0].data.screen_index,8);assert.equal(partial.calls.length,0);
  const retry=launch(pairing.id,{state,fail:true});await new Promise(r=>setImmediate(r));assert(retry.elements.get('jspsych-target').innerHTML.includes('not been saved yet'));
  retry.client.submitAndRedirect=async data=>retry.calls.push({records:data.values()});await retry.elements.get('retry-save').onclick();assert.equal(retry.calls.length,2);assert.equal(retry.calls[1].records.length,21);
 }
 // Test the unmodified official client's condition verifier without loading Firebase.
 const clientSource=fs.readFileSync(path.join(source,'../../study1/explanation-lab-client.js'),'utf8');
 const part=clientSource.slice(clientSource.indexOf('const CONDITION_KEYS'),clientSource.indexOf('function sanitize')).replace('export function','function');
 const verifyContext=vm.createContext({});vm.runInContext(part+';globalThis.verify=verifyObservedCondition;',verifyContext);
 for(const pairing of core.PAIRINGS){const rows=core.ANIMALS.map(id=>({launch_condition:pairing.id,condition:pairing.conditions[id]}));assert.equal(verifyContext.verify(rows,{assignmentType:'counterbalanced_within_participant',integrationMode:'converted',conditions:core.LAUNCH_CONDITIONS},pairing.id).status,'matched');}
 console.log('Six Console pairings: authoritative launch assignment, internal conditions, native condition verification, complete/partial reload, duplicate Sandbox guard, incomplete-save rejection and retry passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
