/**
 * @module tables
 * Common tables that are shared between modules
 */

/** The different compensation types */
export const compensation = [{ name: 'None' }, { name: 'Chain' }, { name: 'Rope' }];

/** Standard rail sizes */
export const railSizes = [
   { name: '6.25#' },
   { name: '8#', stressX: 43200, deflectX: Number('4.3848e8'), stressY: 52200, deflectY: Number('4.9764e8') },
   { name: '11#', stressX: 85800, deflectX: Number('1.23888e9'), stressY: 111600, deflectY: Number('1.54164e9') },
   { name: '12#', stressX: 85800, deflectX: Number('1.23888e9'), stressY: 111600, deflectY: Number('1.54164e9') },
   { name: '15#', stressX: 132600, deflectX: Number('1.92444e9'), stressY: 113400, deflectY: Number('1.65996e9') },
   { name: '18.5#', stressX: 162000, deflectX: Number('2.5926e9'), stressY: 195600, deflectY: Number('3.37908e9') },
   { name: '22.5#', stressX: 187200, deflectX: Number('2.9928e9'), stressY: 249000, deflectY: Number('3.82104e9') },
   { name: '30#', stressX: 255000, deflectX: Number('4.06464e9'), stressY: 419400, deflectY: Number('7.9692e9') },
];

// NOTE: 9-07-2021 9:18 AM
// variants.weight is in lb per foot
// The torque input converts lb per foot to lb to in
/** Common rope sizes */
export const ropeSizes = [
   {
      name: '3/8"',
      value: 0.375,
      weightAv: 0.229,
      variants: [
         { maxLoad: 8200, weight: 0.2 },
         { maxLoad: 8200, weight: 0.21 },
         { maxLoad: 9620, weight: 0.21 },
         { maxLoad: 9900, weight: 0.2 },
         { maxLoad: 9900, weight: 0.21 },
         { maxLoad: 11700, weight: 0.25 },
         { maxLoad: 12225, weight: 0.24 },
         { maxLoad: 13200, weight: 0.25 },
         { maxLoad: 13350, weight: 0.26 },
         { maxLoad: 13600, weight: 0.26 },
      ],
   },
   {
      name: '7/16"',
      value: 0.4375,
      weightAv: 0.315,
      variants: [
         { maxLoad: 11000, weight: 0.28 },
         { maxLoad: 13500, weight: 0.28 },
         { maxLoad: 16000, weight: 0.35 },
         { maxLoad: 18000, weight: 0.35 },
      ],
   },
   {
      name: '1/2"',
      value: 0.5,
      weightAv: 0.402,
      variants: [
         { maxLoad: 14500, weight: 0.36 },
         { maxLoad: 14500, weight: 0.39 },
         { maxLoad: 14500, weight: 0.36 },
         { maxLoad: 17500, weight: 0.36 },
         { maxLoad: 17500, weight: 0.39 },
         { maxLoad: 17500, weight: 0.36 },
         { maxLoad: 20900, weight: 0.46 },
         { maxLoad: 22100, weight: 0.42 },
         { maxLoad: 23500, weight: 0.46 },
         { maxLoad: 24625, weight: 0.46 },
      ],
   },
   {
      name: '9/16"',
      value: 0.5625,
      weightAv: 0.508,
      variants: [
         { maxLoad: 18500, weight: 0.46 },
         { maxLoad: 21100, weight: 0.46 },
         { maxLoad: 22100, weight: 0.46 },
         { maxLoad: 26600, weight: 0.58 },
         { maxLoad: 30000, weight: 0.58 },
      ],
   },
   {
      name: '5/8"',
      value: 0.625,
      weightAv: 0.633,
      variants: [
         { maxLoad: 23000, weight: 0.57 },
         { maxLoad: 23000, weight: 0.59 },
         { maxLoad: 23000, weight: 0.58 },
         { maxLoad: 27200, weight: 0.57 },
         { maxLoad: 27200, weight: 0.59 },
         { maxLoad: 27200, weight: 0.58 },
         { maxLoad: 33300, weight: 0.73 },
         { maxLoad: 34800, weight: 0.66 },
         { maxLoad: 37500, weight: 0.73 },
         { maxLoad: 39125, weight: 0.73 },
      ],
   },
   {
      name: '11/16"',
      value: 0.6875,
      weightAv: 0.8,
      variants: [
         { maxLoad: 27000, weight: 0.69 },
         { maxLoad: 32800, weight: 0.69 },
         { maxLoad: 39800, weight: 0.87 },
         { maxLoad: 42050, weight: 0.81 },
         { maxLoad: 44900, weight: 0.87 },
         { maxLoad: 46750, weight: 0.87 },
      ],
   },
   {
      name: '3/4"',
      value: 0.75,
      weightAv: 0.922,
      variants: [
         { maxLoad: 32000, weight: 0.82 },
         { maxLoad: 38900, weight: 0.82 },
         { maxLoad: 46800, weight: 1.02 },
         { maxLoad: 48925, weight: 0.93 },
         { maxLoad: 52700, weight: 1.02 },
      ],
   },
   { name: '10mm', value: 0.393701, weightAv: 0.25 },
   { name: '11mm', value: 0.433071, weightAv: 0.31 },
   { name: '12mm', value: 0.472441, weightAv: 0.37 },
   { name: '13mm', value: 0.511811, weightAv: 0.43 },
   { name: '14mm', value: 0.551181, weightAv: 0.47 },
   { name: '15mm', value: 0.590551, weightAv: 0.54 },
   { name: '16mm', value: 0.629921, weightAv: 0.63 },
   { name: '18mm', value: 0.708661, weightAv: 0.78 },
];
