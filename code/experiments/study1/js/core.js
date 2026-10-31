(function (root) {
  'use strict';
  const CONDITIONS = ['control', 'survival', 'ecology'];
  const SCREENS = [
    { stage: 'consent', label: 'Consent form' },
    { stage: 'instructions', label: 'Instructions' },
    { stage: 'story', label: 'Story and animals' },
    ...['Importance', 'Survival importance', 'Value', 'Something wrong'].map((label, question) => ({ stage: 'rating', question, label: `Question ${question + 1} · ${label}` })),
    { stage: 'demographics', label: 'Demographics' },
    { stage: 'complete', label: 'Thank you' }
  ];
  function randomCondition() {
    const values = new Uint32Array(1);
    const bound = Math.floor(4294967296 / 3) * 3;
    do { root.crypto.getRandomValues(values); } while (values[0] >= bound);
    return CONDITIONS[values[0] % 3];
  }
  function validRating(value) { return Number.isInteger(value) && value >= 1 && value <= 7; }
  function complete(records, questions) {
    return questions.every(q => records.filter(r => r.trial_role === 'response' && r.question_id === q.id && validRating(r.rating) && typeof r.explanation === 'string' && r.explanation.trim()).length === 1);
  }
  root.NormsCore = { CONDITIONS, SCREENS, randomCondition, validRating, complete };
  if (typeof module !== 'undefined') module.exports = root.NormsCore;
})(globalThis);
