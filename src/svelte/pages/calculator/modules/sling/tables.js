import { round } from 'lib/math.mjs';

const turningMoment1 = (capacity, cabWidth) => (capacity * cabWidth) / 8;

const turningMoment2 = (capacity, cabWidth) => {
   const formula1 = (capacity * cabWidth) / 8;
   const formula2 = capacity * (cabWidth / 2 - 48);

   return Math.max(formula1, formula2);
};

const turningMoment3 = (capacity, cabWidth) => (capacity * cabWidth) / 4;

const modulusAtCen = (load, dist, maxStress) => round(0.5 * ((load * dist) / (4 * maxStress)), 2);

const modulusAtEdgeOffset = (load, dist, maxStress) => round(0.5 * (((load / 2) * dist) / maxStress), 2);

const modulusAtCenOffset = (load, dist, maxStress) => round(0.5 * ((load * 2 * dist) / (4 * maxStress)), 2);

export const cornerPostBrace = [
   {
      name: 'MC6X12',
      weight: 1,
   },
   {
      name: 'MC8X22.8',
      weight: 1.9,
   },
   {
      name: 'MC10X28.5',
      weight: 2.375,
   },
   {
      name: 'W8X35',
      weight: 2.9167,
   },
   {
      name: 'W10X45',
      weight: 3.75,
   },
];

export const plateMounting = [
   {
      name: 'C4X5.4',
      weight: 0.45,
   },
   {
      name: 'C6X8.2',
      weight: 0.6833,
   },
   {
      name: 'C8X11.5',
      weight: 0.9583,
   },
   {
      name: 'L2X2X1/4',
      weight: 0.2658,
   },
];

export const sheaveConfig = {
   parallelOverslung: {
      sheaveOffsetImg: '/img/sling/sheave-offset-1.svg',
      topChanSx: (weight, length, sheaveQty, offset) => (sheaveQty > 1 ? modulusAtEdgeOffset(weight, length / 2 - offset, 14000) : modulusAtCen(weight, length, 14000)),
      botChanSx: (weight, length, plateQty, offset) => (plateQty === 1 ? modulusAtCen(weight, length, 13750) : modulusAtEdgeOffset(weight, length / 2 - offset, 13750)),
      sheaveChanSx: () => 0,
   },
   diagonalOverslung: {
      sheaveOffsetImg: '/img/sling/sheave-offset-2.svg',
      topChanSx: (weight, length) => modulusAtCen(weight, length),
      botChanSx: (weight, length, plateQty, offset) => (plateQty === 1 ? modulusAtCen(weight, length, 13750) : modulusAtEdgeOffset(weight, length / 2 - offset, 13750)),
      sheaveChanSx: (weight, offset) => modulusAtCenOffset(weight, offset, 14000),
   },
   parallelUnderslung: {
      sheaveOffsetImg: '/img/sling/sheave-offset-3.svg',
      topChanSx: () => 0,
      botChanSx: (weight, length, plateQty, offset) => (plateQty === 1 ? modulusAtCen(weight, length, 13750) : modulusAtEdgeOffset(weight, length / 2 - offset, 13750)),
      sheaveChanSx: (weight, offset, length) => modulusAtEdgeOffset(weight, length / 2 - offset, 14000),
   },
   diagonalUnderslung: {
      sheaveOffsetImg: '/img/sling/sheave-offset-2.svg',
      topChanSx: () => 0,
      botChanSx: (weight, length) => modulusAtCen(weight, length, 13750),
      sheaveChanSx: (weight, offset) => modulusAtCenOffset(weight, offset, 14000),
   },
};

export const turningMoment = {
   None: turningMoment1,
   A: turningMoment1,
   'B-Auto': turningMoment2,
   'B-Truck': turningMoment2,
   C1: turningMoment3,
   C2: turningMoment3,
   C3: turningMoment3,
};
