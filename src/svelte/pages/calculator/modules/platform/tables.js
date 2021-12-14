import { round } from 'lib/math.mjs';

const maxPlatformArea = [
   { capacity: 30000, area: 33264 },
   { capacity: 25000, area: 28296 },
   { capacity: 20000, area: 23212.8 },
   { capacity: 18000, area: 21153.6 },
   { capacity: 15000, area: 18014.4 },
   { capacity: 12000, area: 14832 },
   { capacity: 10000, area: 12672 },
   { capacity: 9000, area: 11592 },
   { capacity: 8000, area: 10497.6 },
   { capacity: 7000, area: 9403.2 },
   { capacity: 6000, area: 8308.8 },
   { capacity: 5000, area: 7200 },
   { capacity: 4500, area: 6652.8 },
   { capacity: 4000, area: 6076.8 },
   { capacity: 3500, area: 5472 },
   { capacity: 3000, area: 4852.8 },
   { capacity: 2500, area: 4190.4 },
   { capacity: 2000, area: 3484.8 },
   { capacity: 1800, area: 3182.4 },
   { capacity: 1500, area: 2721.6 },
   { capacity: 1200, area: 2246.4 },
   { capacity: 1000, area: 1908 },
   { capacity: 700, area: 1382.4 },
   { capacity: 600, area: 1195.2 },
   { capacity: 500, area: 1008 },
   { capacity: 0, area: 0 },
];

const frontChannelFormula1 = {
   for: ['None', 'A'],
   sX: (load, length, ratio) => round((load * length) / (14000 * 8 * ratio), 2),
   iX: (load, length, elasticModulus) => round((960 * load * length ** 2) / (192 * elasticModulus), 1),
};

const frontChannelFormula2 = {
   for: ['B-Auto', 'B-Truck'],
   sX: (load, length, ratio) => round((load * (length - 60)) / (14000 * 2 * ratio), 2),
   iX: (load, length, elasticModulus) => round((960 * load * ((length - 60) / 2) * (3 * length ** 2 - 4 * ((length - 60) / 2) ** 2)) / (24 * elasticModulus * length), 1),
};

const frontChannelFormula3 = {
   for: ['C1', 'C2', 'C3'],
   sX: (load, length, ratio) => round((load * (length - 30)) / (14000 * 2 * ratio), 2),
   iX: (load, length, elasticModulus) => round((960 * load * ((length - 30) / 2) * (3 * length ** 2 - 4 * ((length - 30) / 2) ** 2)) / (24 * elasticModulus * length), 1),
};

const load1 = (capacity) => capacity * 0.3;
const load2 = (capacity) => capacity * 0.5;
const load3 = (capacity) => capacity * 0.5 * 1.6;

export const freight = {
   None: { capacityRatio: 0, load: load1, frontChannelFormula: frontChannelFormula1 },
   A: { capacityRatio: 0.347222, load: load1, frontChannelFormula: frontChannelFormula1 },
   'B-Auto': { capacityRatio: 0.208333, load: load2, frontChannelFormula: frontChannelFormula2 },
   'B-Truck': { capacityRatio: 0.208333, load: load2, frontChannelFormula: frontChannelFormula2 },
   C1: { capacityRatio: 0.347222, load: load2, frontChannelFormula: frontChannelFormula3 },
   C2: { capacityRatio: 0.347222, load: load3, frontChannelFormula: frontChannelFormula3 },
   C3: { capacityRatio: 0.347222, load: load2, frontChannelFormula: frontChannelFormula3 },
};

// NOTE: 10-20-2021 8:58 AM - light isolators can support 925 heavy isolators can support 1425 (25lbs less that on part drawing)
const isolatorCombos = [
   { name: '4 light @ 3700#', load: 3700 },
   { name: '6 light @ 5550#', load: 5550 },
   { name: '4 heavy @ 5700#', load: 5700 },
   { name: '8 light @ 7400#', load: 7400 },
   { name: '6 heavy @ 8550#', load: 8550 },
   { name: '10 light @ 9250#', load: 9250 },
   { name: '12 light @ 11100#', load: 11100 },
   { name: '8 heavy @ 11400#', load: 11400 },
   { name: '10 heavy @ 14250#', load: 14250 },
   { name: '12 heavy @ 17100#', load: 17100 },
];

export const steelTypes = [
   { name: 'ASTM A36', elasticModulus: 29000000, tensileStrength: 58 }, // 58ksi = 58000psi
   { name: 'Stainless Steel', elasticModulus: 28000000, tensileStrength: 73.2 }, // 72.2ksi = 37200psi
];

export const getIsolatorCombos = (platformWeight) => isolatorCombos.filter((combo) => combo.load >= platformWeight);

export const getMaxPlatformArea = (capacity) => maxPlatformArea.find((row) => row.capacity <= capacity).area;
