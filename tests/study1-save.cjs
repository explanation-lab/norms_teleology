/* Exercises real study startup/completion with a stubbed collection transport. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = path.join(__dirname, '../code/experiments/study1/js');
let version;

function launch({ condition = 'ecology', complete = false, fail = false, omitQuestion = false, omitDemographics = false } = {}) {
  const elements = new Map();
  const element = id => { if (!elements.has(id)) elements.set(id, { innerHTML: '', onclick: null, addEventListener() {}, reportValidity: () => true, values: {} }); return elements.get(id); };
  const storage = new Map();
  let initialization, timeline, lastTrial, calls = [], jsRecords = [];
  const client = { launch: { studyKey: 'TEST-STUDY', mode: 'sandbox', condition, participant: { prolificPid: 'synthetic', studyId: 'study', sessionId: 'session' } },
    submitAndRedirect: async (data, options) => { calls.push({ records: data.values().map(r => ({ ...r })), options }); if (fail) throw new Error('Synthetic transport failure'); } };
  const context = vm.createContext({
    NORMS_REVIEW: false, NORMS_COLLECTION: true, explanationLab: client, EXPLANATION_LAB_CONDITION: condition,
    location: { search: '?condition=control', href: 'https://example.invalid/?condition=control' },
    URLSearchParams, URL, Uint32Array, crypto: webcrypto, performance, jsPsychHtmlButtonResponse: function () {},
    console: { error() {} },
    document: { getElementById: element }, window: { scrollTo() {} },
    FormData: class { constructor(form) { this.values = form.values; } get(name) { return this.values[name] || null; } },
    localStorage: { getItem: key => storage.get(key), setItem: (key, val) => storage.set(key, val) },
    initJsPsych: options => { initialization = options; return { data: { get: () => ({ push: r => jsRecords.push(r), values: () => jsRecords }) }, run: list => { timeline = list; }, finishTrial: data => { lastTrial = data; } }; }
  });
  for (const file of ['materials.js', 'config.js', 'core.js']) vm.runInContext(fs.readFileSync(path.join(source, file), 'utf8'), context);
  const m = context.NormsMaterials;
  version = m.version;
  const itemOrder = ['marvin', 'virdex', 'nalk'];
  const questionOrder = ['wrongness', 'value', 'significance', 'comparative_importance', 'survival_importance'];
  const records = context.NormsCore.screens(m.items, itemOrder, questionOrder).slice(0, -1).map((screen, screen_index) => {
    const item = m.items.find(item => item.id === screen.item);
    const q = screen.stage === 'rating' ? item.questions[screen.question] : null;
    return { stage: screen.stage, screen_index, condition, ...(screen.stage === 'consent' ? { consent: true } : {}),
      ...(q ? { trial_role: 'response', question_id: context.NormsCore.responseId(item, q), rating: 4, explanation: 'Synthetic explanation.' } : {}),
      ...(screen.stage === 'demographics' ? { screen_id: 'demographics', trial_role: 'demographic', age: '29', gender: 'Non-binary', other_gender: null, race: 'Multiracial', other_race: null, ethnicity: 'Non-Hispanic' } : {}) };
  });
  if (omitQuestion) records.splice(3, 1);
  if (omitDemographics) records.splice(records.findIndex(r => r.stage === 'demographics'), 1);
  if (complete) {
    const identity = JSON.stringify(['TEST-STUDY', 'sandbox', 'synthetic', 'study', 'session', condition]);
    storage.set(version + '-collection:' + identity, JSON.stringify({ version, session_id: 'synthetic-session', condition, item_order: itemOrder, question_order: questionOrder, consented: true, records, next: 21, complete: true }));
  }
  vm.runInContext(fs.readFileSync(path.join(source, 'study.js'), 'utf8'), context);
  return { context, client, calls, elements, records, get timeline() { return timeline; }, get initialization() { return initialization; }, get lastTrial() { return lastTrial; } };
}

(async () => {
  for (const condition of ['control', 'survival', 'ecology']) {
    const fresh = launch({ condition });
    assert.equal(fresh.context.normsStudy.condition, condition, 'Console must override URL/random assignment');
    assert.equal(fresh.timeline.length, 21);
    assert(fresh.timeline.every(t => t.data.condition === condition));
    assert(fresh.timeline.every(t => t.data.valid_participant_data === true));
    assert.equal(new Set(fresh.timeline.filter(t => t.data.trial_role === 'response').map(t => t.data.question_id)).size, 15);
    assert.deepEqual(Array.from(fresh.timeline.filter(t => t.data.stage === 'story').map(t => t.data.item_id)), Array.from(fresh.context.normsStudy.state.item_order));
    for (const trial of fresh.timeline.filter(t => t.data.trial_role === 'response')) {
      assert(trial.stimulus().includes(trial.data.statement.replace(/’/g, '’')));
      assert.equal(trial.data.scale_labels.length, 7);
      assert.equal(trial.data.question_id, trial.data.item_id + '_' + trial.data.measure);
    }
    for (const item of fresh.context.NormsMaterials.items) {
      assert.deepEqual(Array.from(fresh.timeline.filter(t => t.data.trial_role === 'response' && t.data.item_id === item.id).map(t => t.data.measure)), Array.from(fresh.context.normsStudy.state.question_order));
    }
    assert.deepEqual(Array.from(fresh.timeline.filter(t => t.data.trial_role === 'response').map(t => t.data.question_position)), Array.from({length:15}, (_,i)=>i+1));
    assert.equal(fresh.calls.length, 0, 'Opening the study must not submit responses');
    const resumed = launch({ condition, complete: true });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(resumed.calls.length, 1);
    assert.deepEqual(Array.from(resumed.context.normsStudy.state.question_order), ['wrongness', 'value', 'significance', 'comparative_importance', 'survival_importance']);
    assert.deepEqual(Array.from(resumed.calls[0].options.metadata.question_order), Array.from(resumed.context.normsStudy.state.question_order));
    assert.deepEqual(Array.from(resumed.context.normsStudy.state.item_order), ['marvin', 'virdex', 'nalk']);
    assert.equal(resumed.calls[0].records.length, 21, 'Completed reload must restore data BEFORE saving');
    assert.equal(resumed.calls[0].records.filter(r => r.trial_role === 'response').length, 15);
    assert.equal(resumed.calls[0].options.metadata.expected_rating_count, 15);
    assert.deepEqual(Array.from(resumed.calls[0].options.metadata.demographicFields), ['age', 'gender', 'other_gender', 'race', 'other_race', 'ethnicity']);
    assert.equal(resumed.calls[0].records.find(r => r.stage === 'demographics').age, '29');
    assert(resumed.elements.get('jspsych-target').innerHTML.includes('Sandbox complete'));
  }
  const broken = launch({ complete: true, omitQuestion: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(broken.calls.length, 0, 'Incomplete sessions must never be saved as complete');
  assert(broken.elements.get('jspsych-target').innerHTML.includes('incomplete'));
  const missingDemo = launch({ complete: true, omitDemographics: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(missingDemo.calls.length, 0, 'Demographics screen must be visited, even though each answer is optional');
  const formRun = launch();
  const demoTrial = formRun.timeline[20];
  assert.equal(demoTrial.data.trial_role, 'demographic');
  assert(demoTrial.stimulus().includes('These questions are optional. You may leave any item blank.'));
  assert(!demoTrial.stimulus().includes('required'));
  demoTrial.on_start(); demoTrial.on_load();
  const form = formRun.elements.get('demographics-form');
  form.onsubmit({ preventDefault() {} });
  for (const field of ['age', 'gender', 'other_gender', 'race', 'other_race', 'ethnicity']) assert.equal(formRun.lastTrial[field], null);
  form.values = { age: '37', gender: 'other_gender', other_gender: '  Self description  ', race: 'Asian', ethnicity: 'Non-Hispanic' };
  form.onsubmit({ preventDefault() {} });
  assert.equal(formRun.lastTrial.age, '37');
  assert.equal(formRun.lastTrial.other_gender, 'Self description');
  assert.equal(formRun.lastTrial.race, 'Asian');
  const retry = launch({ complete: true, fail: true });
  await new Promise(resolve => setImmediate(resolve));
  assert(retry.elements.get('jspsych-target').innerHTML.includes('not been saved yet'));
  retry.client.submitAndRedirect = async data => retry.calls.push({ records: data.values() });
  await retry.elements.get('retry-save').onclick();
  assert.equal(retry.calls.length, 2);
  assert.equal(retry.calls[1].records.length, 21);
  assert(retry.elements.get('jspsych-target').innerHTML.includes('Sandbox complete'));
  console.log('All conditions: authoritative assignment, complete reload, incomplete-save rejection, and save retry passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
