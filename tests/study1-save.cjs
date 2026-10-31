/* Exercises real study startup/completion with a stubbed collection transport. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = path.join(__dirname, '../code/experiments/study1/js');
const version = 'norms-teleology-study1-1.0.0';

function launch({ condition = 'ecology', complete = false, fail = false, omitQuestion = false } = {}) {
  const elements = new Map();
  const element = id => { if (!elements.has(id)) elements.set(id, { innerHTML: '', onclick: null }); return elements.get(id); };
  const storage = new Map();
  let initialization, timeline, calls = [], jsRecords = [];
  const client = { launch: { studyKey: 'TEST-STUDY', mode: 'sandbox', condition, participant: { prolificPid: 'synthetic', studyId: 'study', sessionId: 'session' } },
    submitAndRedirect: async (data, options) => { calls.push({ records: data.values().map(r => ({ ...r })), options }); if (fail) throw new Error('Synthetic transport failure'); } };
  const context = vm.createContext({
    NORMS_REVIEW: false, NORMS_COLLECTION: true, explanationLab: client, EXPLANATION_LAB_CONDITION: condition,
    location: { search: '?condition=control', href: 'https://example.invalid/?condition=control' },
    URLSearchParams, URL, Uint32Array, crypto: webcrypto, performance, jsPsychHtmlButtonResponse: function () {},
    console: { error() {} },
    document: { getElementById: element }, window: { scrollTo() {} },
    localStorage: { getItem: key => storage.get(key), setItem: (key, val) => storage.set(key, val) },
    initJsPsych: options => { initialization = options; return { data: { get: () => ({ push: r => jsRecords.push(r), values: () => jsRecords }) }, run: list => { timeline = list; } }; }
  });
  for (const file of ['materials.js', 'config.js', 'core.js']) vm.runInContext(fs.readFileSync(path.join(source, file), 'utf8'), context);
  const m = context.NormsMaterials;
  const records = [
    { stage: 'consent', screen_index: 0, consent: true, condition },
    { stage: 'instructions', screen_index: 1, condition },
    { stage: 'story', screen_index: 2, condition },
    ...m.questions.map((q, i) => ({ stage: 'rating', screen_index: i + 3, trial_role: 'response', question_id: q.id, rating: 4, explanation: 'Synthetic explanation.', condition })),
    { stage: 'feedback', screen_index: 7, feedback: '', condition }
  ];
  if (omitQuestion) records.splice(3, 1);
  if (complete) {
    const identity = JSON.stringify(['TEST-STUDY', 'sandbox', 'synthetic', 'study', 'session', condition]);
    storage.set(version + '-collection:' + identity, JSON.stringify({ version, session_id: 'synthetic-session', condition, consented: true, records, next: 8, complete: true }));
  }
  vm.runInContext(fs.readFileSync(path.join(source, 'study.js'), 'utf8'), context);
  return { context, client, calls, elements, records, get timeline() { return timeline; }, get initialization() { return initialization; } };
}

(async () => {
  for (const condition of ['control', 'survival', 'ecology']) {
    const fresh = launch({ condition });
    assert.equal(fresh.context.normsStudy.condition, condition, 'Console must override URL/random assignment');
    assert.equal(fresh.timeline.length, 8);
    assert(fresh.timeline.every(t => t.data.condition === condition));
    assert(fresh.timeline.every(t => t.data.valid_participant_data === true));
    assert.equal(fresh.calls.length, 0, 'Opening the study must not submit responses');
    const resumed = launch({ condition, complete: true });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(resumed.calls.length, 1);
    assert.equal(resumed.calls[0].records.length, 8, 'Completed reload must restore data BEFORE saving');
    assert.equal(resumed.calls[0].records.filter(r => r.trial_role === 'response').length, 4);
    assert.equal(resumed.calls[0].options.metadata.expected_rating_count, 4);
    assert(resumed.elements.get('jspsych-target').innerHTML.includes('Sandbox complete'));
  }
  const broken = launch({ complete: true, omitQuestion: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(broken.calls.length, 0, 'Incomplete sessions must never be saved as complete');
  assert(broken.elements.get('jspsych-target').innerHTML.includes('incomplete'));
  const retry = launch({ complete: true, fail: true });
  await new Promise(resolve => setImmediate(resolve));
  assert(retry.elements.get('jspsych-target').innerHTML.includes('not been saved yet'));
  retry.client.submitAndRedirect = async data => retry.calls.push({ records: data.values() });
  await retry.elements.get('retry-save').onclick();
  assert.equal(retry.calls.length, 2);
  assert.equal(retry.calls[1].records.length, 8);
  assert(retry.elements.get('jspsych-target').innerHTML.includes('Sandbox complete'));
  console.log('All conditions: authoritative assignment, complete reload, incomplete-save rejection, and save retry passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
