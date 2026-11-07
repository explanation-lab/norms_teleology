/* Revised three-animal mixed pilot, 2026-11-05. Each animal and benefit condition occurs once. */
globalThis.NormsMaterials = Object.freeze({
  version: 'norms-teleology-mixed-revised-pilot-1.0.3',
  demographicFields: ["age", "gender", "other_gender", "race", "other_race", "ethnicity"],
  demographics: {
    age: { min: 18, max: 100 },
    gender: [
      { value: 'Female', label: 'Female' }, { value: 'Male', label: 'Male' },
      { value: 'Non-binary', label: 'Non-binary' }, { value: 'other_gender', label: 'Other', textField: 'other_gender' }
    ],
    race: [
      { value: 'White', label: 'White' }, { value: 'Black/African American', label: 'Black/African American' },
      { value: 'American Indian/Alaska Native', label: 'American Indian/Alaska Native' },
      { value: 'Asian', label: 'Asian' }, { value: 'Native Hawaiian/Pacific Islander', label: 'Native Hawaiian/Pacific Islander' },
      { value: 'Multiracial', label: 'Multiracial/Mixed' }, { value: 'other_race', label: 'Other', textField: 'other_race' }
    ],
    ethnicity: [{ value: 'Hispanic', label: 'Hispanic' }, { value: 'Non-Hispanic', label: 'Non-Hispanic' }]
  },
  conditions: {
    control: { label: 'Control' }, survival: { label: 'Survival benefit' }, ecology: { label: 'Ecological benefit' }
  },
  items: [{
    id: 'virdex', label: 'Virdexes',
    setup: 'Virdexes are swamp dwelling creatures. Most virdexes have numerous spots on skin. The spots are scent-producing skin patches.',
  conditions: {
    control: { label: 'Control', text: 'As virdexes move through the swamp, the spots on their backs release a scent. The scent doesn’t have any significant effects on the virdex or the other animals in the area.' },
    survival: { label: 'Survival benefit', text: 'As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite the virdex, so it is more likely to survive.' },
    ecology: { label: 'Ecological benefit', text: 'As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite nearby tree frogs, so more tree frogs survive.' }
  },
  images: [
    { src: 'assets/virdex-spotted.png', caption: 'Most virdexes have lots of spots.', alt: 'A virdex with numerous dark spots on its skin.' },
    { src: 'assets/virdex-unspotted.png', caption: 'However, some virdexes have no spots.', alt: 'The same kind of virdex, with no spots on its skin.' }
  ],
  }, {
    id: 'nalk', label: 'Nalks',
    setup: 'Nalks are surface-swimming animals. Most nalks have dense comb-like hairs along their fins. As nalks swim at the surface of a low-oxygen pond, the comb-like hairs on their fins carry small air bubbles underwater.',
    conditions: {
      survival: { text: 'When nalks dive underwater, the bubbles bring oxygen that the nalk uses, making it more likely to survive.' },
      ecology: { text: 'When nalks dive underwater, the bubbles bring oxygen that fish use, so more fish survive.' },
      control: { text: 'When nalks dive underwater, the bubbles don’t have any significant effects on the nalk or the other animals in the area.' }
    },
    images: [
      { src: 'assets/nalk-prominent-hair.png', caption: 'Most nalks have dense hair along their fins.', alt: 'A nalk with dense comb-like hairs along the edges of its fins.' },
      { src: 'assets/nalk-hairless.png', caption: 'However, some nalks have no hair along their fins.', alt: 'The same kind of nalk, with no hairs along its fins.' }
    ]
  }, {
    id: 'marvin', label: 'Marvins',
    setup: 'Marvins are grassland animals. Most marvins have a single large spike on each hoof. As marvins walk through the grassland, the spikes on their hooves pierce hard seed pods, exposing the seeds.',
    conditions: {
      survival: { text: 'When the spikes crack open the pods, the marvin eats the seeds, making it more likely to survive.' },
      ecology: { text: 'When the spikes crack open the pods, finches eat the seeds, so more finches survive.' },
      control: { text: 'When the spikes crack open the pods, the seeds don’t have any significant effects on the marvin or the other animals in the area.' }
    },
    images: [
      { src: 'assets/marvin-hoof-spikes.png', caption: 'Most marvins have a single large spike on each hoof.', alt: 'A marvin with one large forward-and-downward spike at the ground-contact edge of each hoof.' },
      { src: 'assets/marvin-hooves-no-spikes.png', caption: 'However, some marvins have no spikes on their hooves.', alt: 'The same kind of marvin, with no spikes on its hooves.' }
    ]
  }],
  probe: 'To what extent do you agree with this statement?',
  questions: [
    { id: 'ought_to_have', label: 'Ought to have', text: 'Virdexes ought to have spots.' },
    { id: 'wrongness', label: 'Something wrong', text: 'If a Virdex doesn’t have spots, there is probably something wrong with it.' },
    { id: 'special_importance', label: 'Special importance', text: 'Having spots makes Virdexes especially important creatures.' },
    { id: 'value', label: 'Special value', text: 'Virdexes that have spots are especially valuable in a way that would be lost if Virdexes stopped having spots.' },
    { id: 'meant_to_do', label: 'Meant to do', text: 'A Virdex without spots doesn’t do one of the things it is meant to do.' }
  ],
  scale: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Agree', 'Strongly agree']
});

// Explicit feature wording keeps singular/plural agreement natural for each animal.
NormsMaterials.items.forEach(item => {
  const plural = item.label;
  const singular = { virdex: 'Virdex', nalk: 'Nalk', marvin: 'Marvin' }[item.id];
  const feature = { virdex: 'spots', nalk: 'hair along their fins', marvin: 'spikes on their hooves' }[item.id];
  const singularFeature = { virdex: 'spots', nalk: 'hair along its fins', marvin: 'spikes on its hooves' }[item.id];
  const shortFeature = { virdex: 'spots', nalk: 'hair', marvin: 'spikes' }[item.id];
  const importance = `Having ${shortFeature} makes ${plural} especially important creatures.`;
  const statements = [
    `${plural} ought to have ${feature}.`,
    `If a ${singular} doesn’t have ${singularFeature}, there is probably something wrong with it.`,
    importance,
    `${plural} that have ${shortFeature} are especially valuable in a way that would be lost if ${plural} stopped having ${shortFeature}.`,
    `A ${singular} without ${singularFeature} doesn’t do one of the things it is meant to do.`
  ];
  item.questions = NormsMaterials.questions.map((q, i) => ({ ...q, text: statements[i] }));
});
