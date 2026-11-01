const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.join(__dirname, '../code/experiments/study1');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(base, 'js/materials.js'), 'utf8'), context);
const materials = JSON.parse(JSON.stringify(context.NormsMaterials));
const core = require(path.join(base, 'js/core.js'));
assert.deepEqual(Object.keys(materials.conditions), ['control', 'survival', 'ecology']);
assert.equal(materials.questions.length, 5);
assert.deepEqual(materials.demographicFields, ['age', 'gender', 'other_gender', 'race', 'other_race', 'ethnicity']);
assert.deepEqual(materials.demographics.age, { min: 18, max: 100 });
assert.deepEqual(materials.demographics.gender.map(o => o.value), ['Female', 'Male', 'Non-binary', 'other_gender']);
assert.equal(materials.demographics.race.length, 7);
assert.deepEqual(materials.demographics.ethnicity.map(o => o.value), ['Hispanic', 'Non-Hispanic']);
assert.equal(core.screens(materials.items, materials.items.map(item => item.id))[20].stage, 'demographics');
assert(!core.screens(materials.items, materials.items.map(item => item.id)).some(s => s.stage === 'feedback'));
assert.equal(materials.scale.length, 7);
assert.equal(materials.scale[0], 'Strongly disagree');
assert.equal(materials.scale[3], 'Neither agree nor disagree');
assert.equal(materials.scale[6], 'Strongly agree');
assert(!materials.questions[2].text.includes('special way'));
assert(materials.questions[2].text.includes('that value would be lost'));
assert(materials.items[0].conditions.survival.text.includes('bite virdexes'));
assert(materials.items[0].conditions.ecology.text.includes('bite nearby tree frogs'));
assert(materials.items[0].conditions.control.text.includes('doesn’t have any significant effects'));
for (const image of materials.items.flatMap(item => item.images)) assert(fs.statSync(path.join(base, image.src)).size > 10000);
for (const html of ['index.html', 'participant.html']) {
  const source = fs.readFileSync(path.join(base, html), 'utf8');
  for (const match of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = match[1];
    assert(!/^https?:/.test(target), 'Runtime must not depend on internet resources');
    assert(fs.existsSync(path.join(base, target)), target);
  }
  assert(!source.includes('type="module"'), 'Classic scripts support file browsing');
}
assert(fs.readFileSync(path.join(base, 'index.html'), 'utf8').includes('NORMS_REVIEW = true'));
assert(fs.readFileSync(path.join(base, 'participant.html'), 'utf8').includes('NORMS_REVIEW = false'));
const records = core.expectedQuestions(materials.items).map(q => ({ trial_role: 'response', question_id: q.id, rating: 4, explanation: 'A substantive explanation.' }));
assert(core.complete(records, core.expectedQuestions(materials.items)));
assert(!core.complete(records.slice(1), core.expectedQuestions(materials.items)));
assert(!core.complete([...records, records[0]], core.expectedQuestions(materials.items)));
assert(!core.complete(records.map((r, i) => i ? r : { ...r, explanation: ' ' }), core.expectedQuestions(materials.items)));
assert(!core.complete(records.map((r, i) => i ? r : { ...r, rating: 8 }), core.expectedQuestions(materials.items)));
for (let i = 0; i < 100; i++) assert(core.CONDITIONS.includes(core.randomCondition()));
console.log('Study 1 material, design, completion, and offline-dependency checks passed.');

assert.equal(records.length, 15);
assert.equal(materials.items.length, 3);
assert.equal(materials.questions.find(q => q.id === 'significance').text, 'Virdexes with spots have a significance that is missing in virdexes without spots.');
for (const item of materials.items) {
  assert.equal(item.questions.length, 5);
  for (const condition of core.CONDITIONS) assert(item.conditions[condition].text);
  for (const q of item.questions) assert(q.text.toLowerCase().includes(item.label.toLowerCase()));
}
const permutations = new Set();
for (let i = 0; i < 300; i++) {
  const order = core.randomOrder(materials.items.map(item => item.id));
  assert(core.validOrder(order, materials.items)); permutations.add(order.join(','));
  const screens = core.screens(materials.items, order);
  assert.equal(screens.length, 22); assert.equal(screens.filter(s => s.stage === 'rating').length, 15);
  assert.deepEqual(screens.filter(s => s.stage === 'story').map(s => s.item), order);
}
assert.equal(permutations.size, 6);
assert(!core.validOrder(['virdex', 'virdex', 'nalk'], materials.items));
console.log('Three animals, five measures, all six item orders and species-specific completion checks passed.');

function allPermutations(values) { return values.length ? values.flatMap((v,i) => allPermutations(values.filter((_,j) => i !== j)).map(tail => [v,...tail])) : [[]]; }
const questionOrders = allPermutations(materials.questions.map(q => q.id));
assert.equal(questionOrders.length, 120);
for (const order of questionOrders) {
  const screens = core.screens(materials.items, ['nalk','marvin','virdex'], order);
  for (const item of materials.items) {
    const ratings = screens.filter(s => s.stage === 'rating' && s.item === item.id);
    assert.deepEqual(ratings.map(s => item.questions[s.question].id), order);
    assert.deepEqual(ratings.map(s => s.questionPosition), [0,1,2,3,4]);
  }
}
console.log('All 120 question permutations preserve identical measure order across the three animals.');
