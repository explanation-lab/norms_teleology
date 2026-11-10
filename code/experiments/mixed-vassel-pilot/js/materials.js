/* Revised three-animal mixed pilot, 2026-11-08. Each animal and benefit condition occurs once. */
globalThis.NormsMaterials = Object.freeze({
  version: 'norms-teleology-mixed-vassel-pilot-1.0.1',
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
    survival: { label: 'Survival benefit', text: 'As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite the virdex, making it more likely to survive.' },
    ecology: { label: 'Ecological benefit', text: 'As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite nearby tree frogs, making them more likely to survive.' }
  },
  images: [
    { src: 'assets/virdex-spotted.png', caption: 'Most virdexes have lots of spots.', alt: 'A virdex with numerous dark spots on its skin.' },
    { src: 'assets/virdex-unspotted.png', caption: 'However, some virdexes have no spots.', alt: 'The same kind of virdex, with no spots on its skin.' }
  ],
  }, {
    id: 'nalk', label: 'Nalks',
    setup: 'Nalks are surface-swimming animals. Most nalks have dense comb-like hairs along their fins. As nalks swim at the surface of a low-oxygen pond, the comb-like hairs on their fins carry small air bubbles underwater.',
    conditions: {
      survival: { text: 'When nalks dive underwater, the bubbles bring oxygen that the nalk uses. A nalk can use this oxygen, making it more likely to survive.' },
      ecology: { text: 'When nalks dive underwater, the bubbles bring oxygen that fish use. Fish can use this oxygen, making them more likely to survive.' },
      control: { text: 'When nalks dive underwater, the bubbles don’t have any significant effects on the nalk or the other animals in the area.' }
    },
    images: [
      { src: 'assets/nalk-prominent-hair.png', caption: 'Most nalks have dense hair along their fins.', alt: 'A nalk with dense comb-like hairs along the edges of its fins.' },
      { src: 'assets/nalk-hairless.png', caption: 'However, some nalks have no hair along their fins.', alt: 'The same kind of nalk, with no hairs along its fins.' }
    ]
  }, {
    id: 'vassel', label: 'Vassels',
    setup: 'Vassels are tree-dwelling animals. Most vassels have small, cup-shaped scales on their shoulders.',
    conditions: {
      survival: { text: 'As vassels rest under leafy branches, the cup-shaped scales collect rainwater. During dry weather, a vassel can use this water, making it more likely to survive.' },
      ecology: { text: 'As vassels rest under leafy branches, the cup-shaped scales collect rainwater. During dry weather, nearby tree salamanders can use this water, making them more likely to survive.' },
      control: { text: 'As vassels rest under leafy branches, the cup-shaped scales collect rainwater. During dry weather, the collected water evaporates, without any significant effects on the vassel or other animals in the area.' }
    },
    images: [
      { src: 'assets/vassel-cup-scales.png', caption: 'Most vassels have cup-shaped scales on their shoulders.', alt: 'A tree-dwelling vassel with small upward-opening cup-shaped scales on its shoulders.' },
      { src: 'assets/vassel-no-cup-scales.png', caption: 'However, some vassels have no cup-shaped scales on their shoulders.', alt: 'The same kind of vassel, with no cup-shaped scales on its shoulders.' }
    ]
  }],
  probe: 'To what extent do you agree with this statement?',
  questions: [
    { id: 'ought_to_have', label: 'Ought to have', text: 'Virdexes ought to have spots.' },
    { id: 'wrongness', label: 'Something wrong', text: 'If a Virdex doesn’t have spots, there is probably something wrong with it.' },
    { id: 'special_importance', label: 'Special importance', text: 'Having spots makes Virdexes especially important creatures.' },
    { id: 'value', label: 'Special value', text: 'Virdexes that have spots are especially valuable in a way that would be lost if Virdexes stopped having spots.' },
    { id: 'meant_to_do', label: 'Meant to do', text: 'A Virdex without spots doesn’t do one of the things it is meant to do.' },
    { id: 'reason_to_exist', label: 'Reason to exist', text: 'The spots on Virdexes are a good reason for Virdexes to exist.' }
  ],
  scale: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Agree', 'Strongly agree']
});

// Explicit feature wording keeps singular/plural agreement natural for each animal.
NormsMaterials.items.forEach(item => {
  const plural = item.label;
  const singular = { virdex: 'Virdex', nalk: 'Nalk', vassel: 'Vassel' }[item.id];
  const feature = { virdex: 'spots', nalk: 'hair along their fins', vassel: 'cup-shaped scales on their shoulders' }[item.id];
  const singularFeature = { virdex: 'spots', nalk: 'hair along its fins', vassel: 'cup-shaped scales on its shoulders' }[item.id];
  const shortFeature = { virdex: 'spots', nalk: 'hair', vassel: 'cup-shaped scales' }[item.id];
  const importance = `Having ${shortFeature} makes ${plural} especially important creatures.`;
  const statements = [
    `${plural} ought to have ${feature}.`,
    `If a ${singular} doesn’t have ${singularFeature}, there is probably something wrong with it.`,
    importance,
    `${plural} that have ${shortFeature} are especially valuable in a way that would be lost if ${plural} stopped having ${shortFeature}.`,
    `A ${singular} without ${singularFeature} doesn’t do one of the things it is meant to do.`,
    `The ${shortFeature} on ${plural} ${item.id === 'nalk' ? 'is' : 'are'} a good reason for ${plural} to exist.`
  ];
  item.questions = NormsMaterials.questions.map((q, i) => ({ ...q, text: statements[i] }));
});
