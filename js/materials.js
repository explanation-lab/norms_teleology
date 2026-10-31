/* Study 1.docx, revised by David Rose's approved instructions, 2026-10-31. */
globalThis.NormsMaterials = Object.freeze({
  version: 'norms-teleology-study1-1.1.1',
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
  probe: 'To what extent do you agree with this statement?',
  questions: [
    { id: 'comparative_importance', label: 'Importance', text: 'Virdexes with spots are more important than virdexes without spots.' },
    { id: 'survival_importance', label: 'Survival importance', text: 'It’s more important that virdexes with spots survive than that virdexes without spots survive.' },
    { id: 'value', label: 'Value', text: 'Virdexes with spots are valuable, and that value would be lost if virdexes stopped having spots.' },
    { id: 'wrongness', label: 'Something wrong', text: 'There’s something wrong with virdexes that lack spots.' }
  ],
  scale: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Agree', 'Strongly agree']
});
