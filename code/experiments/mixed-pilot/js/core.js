(function (root) {
  'use strict';
  const CONDITIONS = ['control', 'survival', 'ecology'];
  function randomIndex(size) {
    const values = new Uint32Array(1), bound = Math.floor(4294967296 / size) * size;
    do { root.crypto.getRandomValues(values); } while (values[0] >= bound);
    return values[0] % size;
  }
  const ANIMALS = ['virdex', 'nalk', 'marvin'];
  function permutations(values) { return values.length ? values.flatMap((v,i) => permutations(values.filter((_,j)=>j!==i)).map(tail=>[v,...tail])) : [[]]; }
  const PAIRINGS = permutations(CONDITIONS).map((order,i) => ({ id: `p${i+1}`, conditions: Object.fromEntries(ANIMALS.map((id,j)=>[id,order[j]])) }));
  function randomPairing() { return PAIRINGS[randomIndex(PAIRINGS.length)]; }
  function randomOrder(ids) {
    const order = [...ids];
    for (let i = order.length - 1; i > 0; i--) { const j = randomIndex(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
    return order;
  }
  function validOrder(order, items) { return Array.isArray(order) && order.length === items.length && new Set(order).size === items.length && order.every(id => items.some(item => item.id === id)); }
  function screens(items, order, questionOrder = items[0].questions.map(q => q.id)) {
    if (!validOrder(order, items)) throw new Error('Invalid animal order');
    if (!items.every(item => validOrder(questionOrder, item.questions))) throw new Error('Invalid question order');
    return [
      { stage: 'consent', label: 'Consent form' }, { stage: 'instructions', label: 'Instructions' },
      ...order.flatMap((id, itemPosition) => {
        const item = items.find(item => item.id === id);
        return [{ stage: 'story', item: id, itemPosition, label: `${item.label} · Story and animals` },
          ...questionOrder.map((measure, questionPosition) => {
            const question = item.questions.findIndex(q => q.id === measure), q = item.questions[question];
            return { stage: 'rating', item: id, itemPosition, question, questionPosition, label: `${item.label} · ${q.label}` };
          })];
      }),
      { stage: 'demographics', label: 'Demographics' }, { stage: 'complete', label: 'Thank you' }
    ];
  }
  function responseId(item, question) { return `${item.id}_${question.id}`; }
  function expectedQuestions(items) { return items.flatMap(item => item.questions.map(q => ({ id: responseId(item, q) }))); }
  function validRating(value) { return Number.isInteger(value) && value >= 1 && value <= 7; }
  function complete(records, questions, conditionMap) {
    const responses = records.filter(r => r.trial_role === 'response');
    return responses.length === questions.length && questions.every(q => responses.filter(r => r.question_id === q.id && (!conditionMap || conditionMap[r.item_id] === r.condition) && validRating(r.rating)).length === 1);
  }
  root.NormsCore = { CONDITIONS, ANIMALS, PAIRINGS, LAUNCH_CONDITIONS: PAIRINGS.map(p=>p.id), randomPairing, randomOrder, validOrder, screens, responseId, expectedQuestions, validRating, complete };
  if (typeof module !== 'undefined') module.exports = root.NormsCore;
})(globalThis);
