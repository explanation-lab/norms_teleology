/* jsPsych 7.3.4. Classic scripts and local assets deliberately support file://. */
const CONDITION_ASSIGNMENT = 'between_participant';
const AVAILABLE_CONDITIONS = ['control', 'survival', 'ecology'];
(function () {
  'use strict';
  const m = NormsMaterials, config = NormsConfig, core = NormsCore;
  const review = globalThis.NORMS_REVIEW === true;
  const collection = !review && globalThis.NORMS_COLLECTION === true;
  const explanationLab = collection ? globalThis.explanationLab : null;
  const studyStarted = performance.now();
  const params = new URLSearchParams(location.search);
  const root = document.getElementById('jspsych-target');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let storage;
  try { storage = review ? sessionStorage : localStorage; } catch (_) { /* File browsing can disable storage. */ }
  const identity = collection ? JSON.stringify([explanationLab.launch.studyKey, explanationLab.launch.mode, explanationLab.launch.participant.prolificPid, explanationLab.launch.participant.studyId, explanationLab.launch.participant.sessionId, explanationLab.launch.condition]) : '';
  const key = m.version + (review ? '-review' : collection ? '-collection:' + identity : '-participant');
  let saved;
  try { saved = JSON.parse(storage?.getItem(key) || 'null'); } catch (_) { /* A fresh session is safe. */ }
  const requestedCondition = globalThis.EXPLANATION_LAB_CONDITION || params.get('condition');
  const condition = review
    ? (core.CONDITIONS.includes(requestedCondition) ? requestedCondition : 'control')
    : (core.CONDITIONS.includes(globalThis.EXPLANATION_LAB_CONDITION) ? globalThis.EXPLANATION_LAB_CONDITION
      : (core.CONDITIONS.includes(saved?.condition) ? saved.condition : core.randomCondition()));
  const reusable = saved?.version === m.version && saved.condition === condition && Array.isArray(saved.records);
  let state = reusable ? saved : { version: m.version, session_id: globalThis.crypto.randomUUID?.() || String(Date.now()), condition, consented: false, records: [], next: 0, complete: false };
  if (!core.validOrder(state.item_order, m.items)) state.item_order = review ? m.items.map(item => item.id) : core.randomOrder(m.items.map(item => item.id));
  if (!core.validOrder(state.question_order, m.questions)) state.question_order = review ? m.questions.map(q => q.id) : core.randomOrder(m.questions.map(q => q.id));
  const screens = core.screens(m.items, state.item_order, state.question_order);
  const expectedQuestions = core.expectedQuestions(m.items);
  let current = 0, screenStarted = 0, ratingStarted = null, lastScroll = 0, declined = false, savePromise;
  const persist = () => { try { storage?.setItem(key, JSON.stringify(state)); } catch (_) { /* Study still works without storage. */ } };
  const page = (html, extra = '') => `<section class="page ${extra}">${html}</section>`;
  function story(item) {
    return `<div class="story-block"><div class="story"><p>${escape(item.setup)}</p><p>${escape(item.conditions[condition].text)}</p><div class="animal-pair">${item.images.map(i => `<figure><img src="${i.src}" alt="${escape(i.alt)}" width="1536" height="1024"><figcaption>${escape(i.caption)}</figcaption></figure>`).join('')}</div></div></div>`;
  }
  function consent() {
    return page(`<div class="consent-card"><h1>Consent Form</h1>
      <p>Thank you for agreeing to take part in this study. We appreciate your time and effort. In this study, we will present you with information about fictional animals, and then we will ask you to answer a brief series of questions about those animals. The questions have no right or wrong answers—we’re just exploring features of human psychology in this research. ${escape(config.compensation)} We do not anticipate any risks from participating in this research. While you will not directly benefit from taking part in this research study, we hope society and the scientific community will benefit from the knowledge gained about human psychology and judgment.</p>
      <p>Your involvement should take ${escape(config.duration)}. Your participation is voluntary and you can stop at any time. If you consent to take part in this survey, please indicate so below. If not, simply close your browser window.</p>
      <p>The research data will be collected anonymously. We will not ask you to provide any personally identifiable information (such as an email address or name) and will not be able to link your response to you. We anticipate that your participation in this survey presents no greater risk than everyday use of the Internet. Please note that there is always the possible risk of intrusion by outside agents whenever information is shared over the Internet. This study will run in your browser. Please do not include personally identifying information in your written answers.</p>
      <p>If you have any questions about the research study, please contact Shaun Nichols (sbn44@cornell.edu) at Cornell University. If you have any questions or concerns regarding your rights as a subject in this study, you may contact the Institutional Review Board (IRB) for Human Participants at 607-255-5138 or access their website at <a href="http://www.irb.cornell.edu" target="_blank" rel="noopener">http://www.irb.cornell.edu</a>. You may also report your concerns or complaints anonymously through Ethicspoint online at <a href="http://www.hotline.cornell.edu" target="_blank" rel="noopener">www.hotline.cornell.edu</a> or by calling toll free at 1-866-293-3077. Ethicspoint is an independent organization that serves as a liaison between the University and the person bringing the complaint so that anonymity can be ensured.</p>
      <p>Taking part in this study is voluntary. You can stop at any time. Withdrawal or refusal to participate will not result in any penalty. You do not waive any legal rights or release any agent from liability for negligence by consenting to participate.</p>
      <p>If you consent to take part in this survey, please indicate so below:</p></div>
      <div class="consent-actions"><button id="consent-yes">I consent</button><button id="consent-no">I do NOT consent</button></div>`, 'simple-page');
  }
  function rating(screen) {
    const item = m.items.find(item => item.id === screen.item);
    const q = item.questions[screen.question];
    return page(story(item) + `<section class="question-card" aria-label="Current question"><p class="rating-question" id="agreement-prompt">${escape(m.probe)}</p><p class="statement" id="statement">${escape(q.text)}</p>
      <fieldset class="scale" aria-describedby="agreement-prompt statement"><legend>Agreement rating</legend><div class="scale-options">${m.scale.map((label, i) => `<label><span class="scale-number" aria-hidden="true">${i + 1}</span><input type="radio" name="agreement" value="${i + 1}" aria-label="${i + 1} — ${label}"><span class="scale-label" aria-hidden="true">${label}</span></label>`).join('')}</div></fieldset>
      <div id="explanation-section" class="explanation" hidden><label for="explanation">Please explain your answer.</label><textarea id="explanation" name="explanation" rows="3" aria-describedby="explanation-note"></textarea><p id="explanation-note" class="field-note">Write your explanation, then select Continue.</p></div>
      <div class="rating-action"><button id="rating-continue" disabled>Continue</button></div></section>`);
  }
  function html(screen) {
    if (screen.stage === 'consent') return consent();
    if (screen.stage === 'instructions') return page(`<h1>Instructions</h1><p>You'll read about animals and see pictures of them.</p><p>Please read the information about the animals very carefully and then answer the questions that follow.</p><p>When you are ready to begin, please click Begin below.</p><button id="stage-continue">Begin</button>`, 'simple-page instructions-page');
    if (screen.stage === 'story') return page('<strong class="read-instruction" style="text-align:center">Please read the following very carefully before answering any questions.</strong>' + story(m.items.find(item => item.id === screen.item)) + '<div class="story-action"><button id="stage-continue">Continue</button></div>');
    if (screen.stage === 'rating') return rating(screen);
    if (screen.stage === 'demographics') return demographics();
    return thankYou();
  }
  function demographics() {
    const prior = state.records.find(r => r.stage === 'demographics') || {};
    const radios = (name, title) => `<fieldset><legend>${title}</legend>${m.demographics[name].map(option => `<div class="demographic-option"><label><input type="radio" name="${name}" value="${escape(option.value)}"${prior[name] === option.value ? ' checked' : ''}> ${escape(option.label)}${option.textField ? ':' : ''}</label>${option.textField ? `<input type="text" name="${option.textField}" aria-label="Other ${name}" value="${escape(prior[option.textField] || '')}">` : ''}</div>`).join('')}</fieldset>`;
    return page(`<h1>About you</h1><p>These questions are optional. You may leave any item blank.</p><form id="demographics-form"><div class="demographic-grid"><fieldset><legend>Age</legend><input name="age" type="number" min="${m.demographics.age.min}" max="${m.demographics.age.max}" step="1" inputmode="numeric" aria-label="Age" value="${escape(prior.age || '')}"></fieldset>${radios('gender', 'Gender')}${radios('race', 'Race')}${radios('ethnicity', 'Ethnicity')}</div><div class="demographic-footer"><p class="field-note">Press Finish to complete the study.</p><button type="submit">Finish</button></div></form>`, 'simple-page');
  }
  function thankYou() {
    return page(`<h1>Thank you</h1><p>${review ? 'You have reached the end of the study preview.' : 'You have completed the study.'}</p>${review ? '<p>Use the reviewer panel to inspect another condition or return to any screen.</p>' : '<p class="local-note">This local study copy does not send responses to a server. You can download this session below.</p>'}<div class="export-actions"><button id="download-json">Download ${review ? 'review responses' : 'responses'} (JSON)</button><button id="download-csv">Download ratings (CSV)</button><button id="download-demographics">Download demographics (CSV)</button></div>`, 'simple-page thank-you');
  }
  function download(format = 'json') {
    const demographicRow = state.records.find(r => r.stage === 'demographics');
    const demographics = demographicRow ? Object.fromEntries(m.demographicFields.map(field => [field, demographicRow[field] ?? null])) : null;
    const payload = { study_version: m.version, project_id: config.projectId, session_id: state.session_id, condition, item_order: state.item_order, question_order: state.question_order, review_mode: review, valid_participant_data: false, collection_mode: review ? 'review' : 'local_preview', consented: state.consented, complete: state.complete, scale_labels: m.scale, demographics, trials: state.records };
    const columns = ['session_id','condition','item_id','item_position','measure','question_id','question_position','statement','rating','rating_label','explanation','rating_rt','rt','review_mode','valid_participant_data','study_version'];
    const quote = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const demoColumns = ['session_id', 'condition', ...m.demographicFields, 'review_mode', 'valid_participant_data', 'study_version'];
    const demoRecord = { ...payload, ...demographics };
    const data = format === 'demographics' ? [demoColumns.join(','), ...(demographicRow ? [demoColumns.map(k => quote(demoRecord[k])).join(',')] : [])].join('\r\n')
      : format === 'csv' ? [columns.join(','), ...state.records.filter(r => r.trial_role === 'response').map(r => columns.map(k => quote(r[k])).join(','))].join('\r\n') : JSON.stringify(payload, null, 2);
    const isCsv = format === 'csv' || format === 'demographics';
    const url = URL.createObjectURL(new Blob([data], { type: isCsv ? 'text/csv;charset=utf-8' : 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `norms-teleology-study1-${review ? 'review' : 'local'}-${condition}${format === 'demographics' ? '-demographics' : ''}.${isCsv ? 'csv' : 'json'}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function bindDownloads() {
    document.getElementById('download-json')?.addEventListener('click', () => download());
    document.getElementById('download-csv')?.addEventListener('click', () => download('csv'));
    document.getElementById('download-demographics')?.addEventListener('click', () => download('demographics'));
  }
  function updatePanel() {
    if (!review) return;
    document.getElementById('review-screen').value = String(current);
    document.getElementById('review-status').textContent = `${m.conditions[condition].label} · ${screens[current].label} · ${state.records.filter(r => r.trial_role === 'response').length} review answers in this condition`;
    document.getElementById('review-previous').disabled = current === 0;
    document.getElementById('review-next').disabled = current === screens.length - 1;
    document.getElementById('review-explanation').disabled = screens[current].stage !== 'rating';
  }
  function navigate(index, nextCondition = condition) {
    persist(); const url = new URL(location.href); url.searchParams.set('condition', nextCondition); url.searchParams.set('screen', Math.max(0, Math.min(screens.length - 1, index))); location.assign(url.href);
  }
  function reviewPanel() {
    if (!review) return;
    const select = document.getElementById('review-screen');
    screens.forEach((s, i) => { const option = document.createElement('option'); option.value = i; option.textContent = s.label; select.append(option); });
    select.onchange = () => navigate(Number(select.value));
    document.getElementById('review-condition').value = condition;
    document.getElementById('review-condition').onchange = e => navigate(current, e.target.value);
    document.getElementById('review-previous').onclick = () => navigate(current - 1);
    document.getElementById('review-next').onclick = () => navigate(current + 1);
    document.getElementById('review-export').onclick = () => download();
    document.getElementById('review-reset').onclick = () => { state = { ...state, records: [], consented: false, next: 0, complete: false }; navigate(0); };
    document.getElementById('review-explanation').onclick = () => { document.getElementById('explanation-section').hidden = false; document.getElementById('explanation').focus({ preventScroll: true }); };
    document.getElementById('toggle-panel').onclick = e => { const controls = document.getElementById('panel-controls'); controls.hidden = !controls.hidden; e.target.textContent = controls.hidden ? 'Show controls' : 'Hide controls'; e.target.setAttribute('aria-expanded', String(!controls.hidden)); };
  }
  function bind(screen) {
    screenStarted = performance.now(); ratingStarted = null;
    const finish = data => { lastScroll = window.scrollY; jsPsych.finishTrial({ rt: Math.round(performance.now() - screenStarted), ...data }); };
    document.getElementById('stage-continue')?.addEventListener('click', () => finish({}));
    if (screen.stage === 'consent') {
      document.getElementById('consent-yes').onclick = () => { state.consented = true; finish({ consent: true }); };
      document.getElementById('consent-no').onclick = () => {
        state.consented = false; state.records = []; state.next = 0; state.complete = false; persist();
        declined = true;
        jsPsych.endExperiment();
      };
    }
    if (screen.stage === 'rating') {
      const prior = state.records.find(r => r.question_id === core.responseId(m.items.find(item => item.id === screen.item), m.items.find(item => item.id === screen.item).questions[screen.question]));
      const explanation = document.getElementById('explanation');
      const button = document.getElementById('rating-continue');
      const update = () => { const selected = document.querySelector('input[name="agreement"]:checked'); button.disabled = !selected || !explanation.value.trim(); };
      document.querySelectorAll('input[name="agreement"]').forEach(input => input.onchange = () => {
        if (ratingStarted === null) ratingStarted = Math.round(performance.now() - screenStarted);
        document.getElementById('explanation-section').hidden = false; update();
      });
      explanation.oninput = update;
      if (review && prior) { document.querySelector(`input[value="${prior.rating}"]`).checked = true; explanation.value = prior.explanation; document.getElementById('explanation-section').hidden = false; update(); }
      button.onclick = () => { const selected = document.querySelector('input[name="agreement"]:checked'); if (!selected || !explanation.value.trim()) return; button.disabled = true; finish({ rating: Number(selected.value), rating_label: m.scale[Number(selected.value) - 1], explanation: explanation.value.trim(), rating_rt: ratingStarted }); };
    }
    if (screen.stage === 'demographics') {
      const form = document.getElementById('demographics-form');
      form.onsubmit = e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const values = new FormData(form);
        const demographics = Object.fromEntries(m.demographicFields.map(name => [name, String(values.get(name) || '').trim() || null]));
        finish({ screen_id: 'demographics', ...demographics, final_questions_rt_ms: Math.round(performance.now() - screenStarted) });
      };
    }
    bindDownloads();
    updatePanel();
    if (screen.stage === 'rating' && current > 3) requestAnimationFrame(() => window.scrollTo(0, lastScroll));
    else window.scrollTo(0, 0);
  }
  function trial(screen, index) {
    const item = m.items.find(item => item.id === screen.item);
    const q = screen.stage === 'rating' ? item.questions[screen.question] : null;
    return { type: jsPsychHtmlButtonResponse, choices: [], stimulus: () => html(screen), data: {
      study_version: m.version, session_id: state.session_id, condition, review_mode: review,
      valid_participant_data: collection, collection_mode: collection ? explanationLab.launch.mode : review ? 'review' : 'local_preview',
      item_order: state.item_order, question_order: state.question_order, ...(item ? { species: item.id, item_id: item.id, item_position: screen.itemPosition + 1, story_setup: item.setup, story_condition: item.conditions[condition].text } : {}),
      screen_index: index, stage: screen.stage, trial_role: q ? 'response' : screen.stage === 'demographics' ? 'demographic' : 'screen',
      ...(q ? { question_id: core.responseId(item, q), measure: q.id, question_position: screen.itemPosition * m.questions.length + screen.questionPosition + 1, within_item_question_position: screen.questionPosition + 1, statement: q.text, probe: m.probe, scale_min: 1, scale_max: 7, scale_labels: m.scale, story_setup: item.setup, story_condition: item.conditions[condition].text, image_feature_present: item.images[0].src, image_feature_absent: item.images[1].src } : {})
    }, on_start: () => { current = index; }, on_load: () => bind(screen), on_finish: data => {
      delete data.stimulus;
      if (!review && !state.consented) return;
      state.records = state.records.filter(r => r.screen_index !== index); state.records.push({ ...data });
      state.next = index + 1; persist();
    } };
  }
  async function completed() {
    if (declined) { root.innerHTML = page('<h1>Thank you</h1><p>You have not consented. No study responses have been submitted. You may close this window.</p>', 'simple-page thank-you'); return; }
    state.complete = state.consented && core.complete(state.records, expectedQuestions) && state.records.some(r => r.stage === 'demographics'); persist();
    if (collection) {
      if (!state.complete || !state.records.some(r => r.stage === 'consent' && r.consent === true) || state.records.some(r => r.condition !== condition)) {
        root.innerHTML = page('<h1>The study is incomplete</h1><p>Please reopen your study link to continue.</p>', 'simple-page'); return;
      }
      if (state.saved && explanationLab.launch.mode === 'sandbox') { root.innerHTML = page('<h1>Sandbox complete</h1><p>Your responses have already been saved to the Explanation Lab.</p>', 'simple-page'); return; }
      if (savePromise) return savePromise;
      root.innerHTML = page('<h1>Saving your responses…</h1><p>Please keep this page open.</p>', 'simple-page');
      savePromise = (async () => {
        try {
          await explanationLab.submitAndRedirect(jsPsych.data.get(), { durationMs: performance.now() - studyStarted, showRetryScreen: false,
            metadata: { experimentVersion: m.version, schemaVersion: '2.0.0', demographicFields: m.demographicFields, expected_rating_count: expectedQuestions.length, species: m.items.map(item => item.id), item_order: state.item_order, question_order: state.question_order } });
          state.saved = true; persist();
          if (explanationLab.launch.mode === 'sandbox') root.innerHTML = page('<h1>Sandbox complete</h1><p>Your responses have been saved to the Explanation Lab.</p>', 'simple-page');
        } catch (error) {
          savePromise = null;
          root.innerHTML = page('<h1>Your responses have not been saved yet</h1><p>Please keep this page open and retry. You will return to Prolific only after saving succeeds.</p><button id="retry-save">Retry saving</button>', 'simple-page');
          document.getElementById('retry-save').onclick = completed;
          console.error('Study save needs retry', error);
        }
      })();
      return savePromise;
    }
    current = screens.length - 1; root.innerHTML = thankYou(); bindDownloads(); updatePanel(); window.scrollTo(0, 0);
  }
  const jsPsych = initJsPsych({ display_element: 'jspsych-target', on_finish: completed });
  // Expose jsPsych data for the Console converter and researcher inspection.
  globalThis.normsStudy = { jsPsych, download, condition, review, get state() { return state; } };
  reviewPanel(); persist();
  let start = review ? Number(params.get('screen') || 0) : (state.consented ? state.next : 0);
  if (!Number.isInteger(start) || start < 0 || start >= screens.length) start = 0;
  // Restore earlier responses into jsPsych so a resumed export remains complete.
  if (!review && state.consented) state.records.forEach(record => jsPsych.data.get().push({ ...record }));
  if (start === screens.length - 1 || (!review && state.complete)) { completed(); return; }
  jsPsych.run(screens.slice(start, -1).map((screen, offset) => trial(screen, start + offset)));
})();
