const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=path.join(__dirname,'../code/experiments/mixed-pilot/js');
const wrapper=fs.readFileSync(path.join(source,'collection.js'),'utf8').replace(/^import createExplanationLabClient.*;\n/m,'').replace("await import('./study.js');","globalThis.started=true;");
(async()=>{
 for(const code of ['p1','p2','p3','p4','p5','p6'])for(const input of ['order','condition','both']){
  const url=new URL('https://example.invalid/mixed-pilot/?study=SYNTHETIC&mode=sandbox&PROLIFIC_PID=TEST&SESSION_ID=TEST');
  if(input!=='condition')url.searchParams.set('order',code);if(input!=='order')url.searchParams.set('condition',code);
  const location={href:url.href,search:url.search};let launches=0;
  const context=vm.createContext({URL,URLSearchParams,location,history:{replaceState:(_s,_t,href)=>{const next=new URL(href);location.href=next.href;location.search=next.search;}},
   createExplanationLabClient:async()=>{launches++;return{study:{experimentVersion:'test',conditions:['p1','p2','p3','p4','p5','p6']},launch:{condition:new URLSearchParams(location.search).get('condition')}};},console:{error(){}}});
  context.NormsMaterials={version:'test'};context.NormsCore={LAUNCH_CONDITIONS:['p1','p2','p3','p4','p5','p6']};
  await vm.runInContext('(async()=>{'+wrapper+'})()',context);
  assert(context.started);assert.equal(launches,1);assert.equal(context.EXPLANATION_LAB_CONDITION,code);
  assert.equal(new URL(location.href).searchParams.get('PROLIFIC_PID'),'TEST');
 }
 console.log('All six pairings launch correctly via order=, condition=, or matching dual parameters; participant identifiers preserved.');
})().catch(e=>{console.error(e);process.exitCode=1;});
