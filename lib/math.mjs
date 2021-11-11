/**
 * @module math A module for various math operations
 */

/**
 * Rounds a number to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const round = (value, decimals = 0) => {
   value = Number.parseFloat(value).toFixed(20);
   return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

/**
 * Rounds a number down to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const floor = (value, decimals = 0) => Number(Math.floor(value + 'e' + decimals) + 'e-' + decimals);

/**
 * Rounds a number up to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const ceil = (value, decimals = 0) => Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals);

/**
 * Rounds a number to the nearest increment
 * @param {number} value The value to round
 * @param {number} increment The number to round to
 */
export const roundInc = (value, increment = 0.0625) => round(Math.round(value / increment) * increment, 4);

/**
 * Rounds a number up to the nearest increment
 * @param {number} value The value to round
 * @param {number} increment The number to round to
 */
export const ceilInc = (value, increment = 0.0625) => ceil(Math.ceil(value / increment) * increment, 4);

/**
 * Rounds a number down to the nearest increment
 * @param {number} value The value to round
 * @param {number} increment The number to round to
 */
export const floorInc = (value, increment = 0.0625) => floor(Math.floor(value / increment) * increment, 4);

/**
 * Converts degrees to radians
 * @param {number} deg The angle in degrees
 */
export const radians = (deg) => (deg * Math.PI) / 180;

/**
 * Returns the sine of a number.
 * @param {number} deg The angle in degrees
 */
export const sin = (deg) => Math.sin(radians(deg));

/**
 * Returns the cosine of a number.
 * @param {number} deg The angle in degrees
 */
export const cos = (deg) => Math.cos(radians(deg));

/**
 * Returns the tangent of a number.
 * @param {number} deg The angle in degrees
 */
export const tan = (deg) => Math.tan(radians(deg));

/**
 * Get's the greatest common denominator between two numbers
 * @param {number} numA The first number to compare
 * @param {number} numB The second number to compare
 * @returns {number} The greatest common denominator
 */
export const gcd = (numA, numB) => {
   if (numB < 0.0000001) return numA;
   return gcd(numB, Math.floor(numA % numB));
};

/**
 * Converts a decimal to a fraction object
 * @param {number} num The number to convert
 */
export const toFraction = (num) => {
   const length = num.toString().length - 2;
   let denominator = length ** 10;
   let numerator = num * denominator;
   const divisor = gcd(numerator, denominator);
   numerator /= divisor;
   denominator /= divisor;

   return { numerator, denominator };
};

/**
 * Gets the average from an array of numbers
 * @param {number[]} numbers The numbers to average
 */
export const average = (numbers) => numbers.reduce((a, b) => a + b) / numbers.length;

/**
 * Add all the numbers in an array
 * @param {number[]} numbers The numbers to add together
 */
export const sum = (numbers) => numbers.reduce((total, number) => total + number);
