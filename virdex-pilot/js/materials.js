/* Revised Virdex cases with David Rose’s four new measures, 2026-11-03. */
globalThis.NormsMaterials = Object.freeze({
  "version": "norms-teleology-virdex-pilot-1.0.0",
  "demographicFields": [
    "age",
    "gender",
    "other_gender",
    "race",
    "other_race",
    "ethnicity"
  ],
  "demographics": {
    "age": {
      "min": 18,
      "max": 100
    },
    "gender": [
      {
        "value": "Female",
        "label": "Female"
      },
      {
        "value": "Male",
        "label": "Male"
      },
      {
        "value": "Non-binary",
        "label": "Non-binary"
      },
      {
        "value": "other_gender",
        "label": "Other",
        "textField": "other_gender"
      }
    ],
    "race": [
      {
        "value": "White",
        "label": "White"
      },
      {
        "value": "Black/African American",
        "label": "Black/African American"
      },
      {
        "value": "American Indian/Alaska Native",
        "label": "American Indian/Alaska Native"
      },
      {
        "value": "Asian",
        "label": "Asian"
      },
      {
        "value": "Native Hawaiian/Pacific Islander",
        "label": "Native Hawaiian/Pacific Islander"
      },
      {
        "value": "Multiracial",
        "label": "Multiracial/Mixed"
      },
      {
        "value": "other_race",
        "label": "Other",
        "textField": "other_race"
      }
    ],
    "ethnicity": [
      {
        "value": "Hispanic",
        "label": "Hispanic"
      },
      {
        "value": "Non-Hispanic",
        "label": "Non-Hispanic"
      }
    ]
  },
  "conditions": {
    "control": {
      "label": "Control"
    },
    "survival": {
      "label": "Survival benefit"
    },
    "ecology": {
      "label": "Ecological benefit"
    }
  },
  "items": [
    {
      "id": "virdex",
      "label": "Virdexes",
      "setup": "Virdexes are swamp dwelling creatures. Most virdexes have numerous spots on skin. The spots are scent-producing skin patches.",
      "conditions": {
        "control": {
          "label": "Control",
          "text": "As virdexes move through the swamp, the spots on their backs release a scent. The scent doesn’t have any significant effects on the virdex or the other animals in the area."
        },
        "survival": {
          "label": "Survival benefit",
          "text": "As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite the virdex, so it is more likely to survive."
        },
        "ecology": {
          "label": "Ecological benefit",
          "text": "As virdexes move through the swamp, the spots on their backs release a scent that drives away biting flies. The flies would otherwise bite nearby tree frogs, so more tree frogs survive."
        }
      },
      "images": [
        {
          "src": "assets/virdex-spotted.png",
          "caption": "Most virdexes have lots of spots.",
          "alt": "A virdex with numerous dark spots on its skin."
        },
        {
          "src": "assets/virdex-unspotted.png",
          "caption": "However, some virdexes have no spots.",
          "alt": "The same kind of virdex, with no spots on its skin."
        }
      ],
      "questions": [
        {
          "id": "ought_to_have",
          "label": "Ought to have spots",
          "text": "Virdexes ought to have spots"
        },
        {
          "id": "best_to_have",
          "label": "Best to have spots",
          "text": "It would be best for a Virdex to have spots"
        },
        {
          "id": "wrongness",
          "label": "Something wrong",
          "text": "If a Virdex doesn’t have spots, there’s probably something wrong with it."
        },
        {
          "id": "special_importance",
          "label": "Special importance",
          "text": "The spots make Virdexes especially important creatures."
        }
      ]
    }
  ],
  "probe": "To what extent do you agree with this statement?",
  "questions": [
    {
      "id": "ought_to_have",
      "label": "Ought to have spots",
      "text": "Virdexes ought to have spots"
    },
    {
      "id": "best_to_have",
      "label": "Best to have spots",
      "text": "It would be best for a Virdex to have spots"
    },
    {
      "id": "wrongness",
      "label": "Something wrong",
      "text": "If a Virdex doesn’t have spots, there’s probably something wrong with it."
    },
    {
      "id": "special_importance",
      "label": "Special importance",
      "text": "The spots make Virdexes especially important creatures."
    }
  ],
  "scale": [
    "Strongly disagree",
    "Disagree",
    "Somewhat disagree",
    "Neither agree nor disagree",
    "Somewhat agree",
    "Agree",
    "Strongly agree"
  ]
});
