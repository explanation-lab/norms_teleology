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
assert.equal(materials.questions.length, 4);
assert.equal(materials.scale.length, 7);
assert.equal(materials.scale[0], 'Strongly disagree');
assert.equal(materials.scale[3], 'Neither agree nor disagree');
assert.equal(materials.scale[6], 'Strongly agree');
assert(!materials.questions[2].text.includes('special way'));
assert(materials.questions[2].text.includes('that value would be lost'));
assert(materials.conditions.survival.text.includes('bite virdexes'));
assert(materials.conditions.ecology.text.includes('bite nearby tree frogs'));
assert(materials.conditions.control.text.includes('doesn’t have any significant effects'));
for (const image of materials.images) assert(fs.statSync(path.join(base, image.src)).size > 10000);
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
const records = materials.questions.map(q => ({ trial_role: 'response', question_id: q.id, rating: 4, explanation: 'A substantive explanation.' }));
assert(core.complete(records, materials.questions));
assert(!core.complete(records.slice(1), materials.questions));
assert(!core.complete([...records, records[0]], materials.questions));
assert(!core.complete(records.map((r, i) => i ? r : { ...r, explanation: ' ' }), materials.questions));
assert(!core.complete(records.map((r, i) => i ? r : { ...r, rating: 8 }), materials.questions));
for (let i = 0; i < 100; i++) assert(core.CONDITIONS.includes(core.randomCondition()));
console.log('Study 1 material, design, completion, and offline-dependency checks passed.');
