import { roundInc } from 'lib/math.mjs';

const springSpeeds = [
   { actual: 125, adjusted: 175 },
   { actual: 150, adjusted: 210 },
   { actual: 175, adjusted: 250 },
   { actual: 200, adjusted: 280 },
];

const getSpAdjSpd = (speed) => springSpeeds.find((row) => row.actual < speed);

const getOilAdjSpd = (speed) => speed * 1.15;

export const getStopDist = (style, speed) => {
   const adjustedSpeed = style === 'Oil' ? getOilAdjSpd(speed) : getSpAdjSpd(speed);

   return roundInc(adjustedSpeed ** 2 / 19320 / 2, 0.25);
};
