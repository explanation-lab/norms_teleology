/* Study 1.docx, revised by David Rose's approved instructions, 2026-10-31. */
globalThis.NormsMaterials = Object.freeze({
  version: 'norms-teleology-study1-2.1.0',
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
    control: { label: 'Control', text: 'As virdexes move through the swamp, the spots on their backs release a scent. The scent is mild and doesn’t have any significant effects on the virdexes or the other animals in the area.' },
    survival: { label: 'Survival benefit', text: 'As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite virdexes, so more virdexes survive.' },
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
      survival: { text: 'When nalks dive underwater, the bubbles bring oxygen to nalks living in the pond, helping more nalks survive.' },
      ecology: { text: 'When nalks dive underwater, the bubbles bring oxygen to snails living in the pond, helping more snails survive.' },
      control: { text: 'When nalks dive underwater, they carry the air bubbles down, producing harmless bubbles on the pond.' }
    },
    images: [
      { src: 'assets/nalk-prominent-hair.png', caption: 'Most nalks have dense hair along their fins.', alt: 'A nalk with dense comb-like hairs along the edges of its fins.' },
      { src: 'assets/nalk-hairless.png', caption: 'However, some nalks have no hair along their fins.', alt: 'The same kind of nalk, with no hairs along its fins.' }
    ]
  }, {
    id: 'marvin', label: 'Marvins',
    setup: 'Marvins are grassland animals. Most marvins have many spikes on their feet. As marvins move through the grassland, the spikes on their feet crack open hard seed pods.',
    conditions: {
      survival: { text: 'The exposed seeds feed marvins that live there, helping more marvins survive.' },
      ecology: { text: 'The exposed seeds feed finches that live there, helping more finches survive.' },
      control: { text: 'The exposed seeds make the grass look more blue, but do not harm the grass.' }
    },
    images: [
      { src: 'assets/marvin-prominent-spikes.png', caption: 'Most marvins have many spikes on their feet.', alt: 'A marvin with many spikes on the upper surfaces of its feet.' },
      { src: 'assets/marvin-normal-feet.png', caption: 'However, some marvins have no spikes on their feet.', alt: 'The same kind of marvin, with no spikes on its feet.' }
    ]
  }],
  probe: 'To what extent do you agree with this statement?',
  questions: [
    { id: 'comparative_importance', label: 'Importance', text: 'Virdexes with spots are more important than virdexes without spots.' },
    { id: 'survival_importance', label: 'Survival importance', text: 'It’s more important that virdexes with spots survive than that virdexes without spots survive.' },
    { id: 'value', label: 'Value', text: 'Virdexes with spots are valuable, and that value would be lost if virdexes stopped having spots.' },
    { id: 'significance', label: 'Significance', text: 'Virdexes with spots have a significance that is missing in virdexes without spots.' },
    { id: 'wrongness', label: 'Something wrong', text: 'There’s something wrong with virdexes that lack spots.' }
  ],
  scale: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Agree', 'Strongly agree']
});

// Wording is parallel across animal items; measure IDs are stable across species.
NormsMaterials.items.forEach(item => {
  const name = item.label, lower = name.toLowerCase();
  const feature = item.id === 'virdex' ? 'spots' : item.id === 'nalk' ? 'dense hair along their fins' : 'spikes on their feet';
  item.questions = NormsMaterials.questions.map(q => ({ ...q,
    text: q.text.replaceAll('Virdexes', name).replaceAll('virdexes', lower).replaceAll('spots', feature)
  }));
});
