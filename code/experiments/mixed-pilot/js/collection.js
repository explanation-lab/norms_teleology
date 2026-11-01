/* Frozen official client; this entry requires a real Console launch URL. */
import createExplanationLabClient from '../explanation-lab-client.js';

try {
  // The Console uses order= for counterbalanced launches; the frozen client
  // accepts condition=. Normalize those equivalent launch codes before startup.
  const launchUrl = new URL(location.href);
  const orderCode = launchUrl.searchParams.getAll('order')[0] || null;
  if (orderCode) {
    const conditionCode = launchUrl.searchParams.get('condition');
    if (conditionCode && conditionCode !== orderCode) throw new Error('Conflicting pairing codes in the study link. Please reopen the Console link.');
    if (!NormsCore.LAUNCH_CONDITIONS.includes(orderCode)) throw new Error('Unknown pairing code in the study link.');
    launchUrl.searchParams.set('condition', orderCode);
    history.replaceState(null, '', launchUrl.href);
  }
  if (!new URLSearchParams(location.search).get('study')) throw new Error('Please open this study using its Study Console participant link. To review the materials, open review.html.');
  const explanationLab = await createExplanationLabClient({ experimentVersion: NormsMaterials.version });
  if (explanationLab.study.experimentVersion !== NormsMaterials.version ||
      explanationLab.study.conditions.length !== NormsCore.LAUNCH_CONDITIONS.length ||
      NormsCore.LAUNCH_CONDITIONS.some(c => !explanationLab.study.conditions.includes(c)) ||
      !NormsCore.LAUNCH_CONDITIONS.includes(explanationLab.launch.condition)) throw new Error('This link belongs to a different study or version. Please contact the researcher.');
  globalThis.explanationLab = explanationLab;
  globalThis.EXPLANATION_LAB_CONDITION = explanationLab.launch.condition;
  await import('./study.js');
} catch (error) {
  const main = document.getElementById('jspsych-target');
  const section = document.createElement('section'); section.className = 'page simple-page'; section.setAttribute('role', 'alert');
  const heading = document.createElement('h1'); heading.textContent = 'Unable to open the study';
  const text = document.createElement('p'); text.textContent = error.message || 'Please reopen your study link or contact the researcher.';
  section.append(heading, text); main.replaceChildren(section);
  console.error('Study startup failed', error);
}
