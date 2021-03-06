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
   let denominator = 10 ** length;
   let numerator = num * denominator;
   const divisor = gcd(numerator, denominator);
   numerator /= divisor;
   denominator /= divisor;

   return { numerator, denominator };
};

/**
 * Converts a decimal to a length string
 * @param {number} num The number to convert
 */
export const toLengthString = (num) => {
   if (num <= 0) return '0"';

   const fr = toFraction(num % 1);
   const inch = floor(num % 12);
   const ft = floor(num / 12);

   let output = fr.numerator ? `${fr.numerator}/${fr.denominator}` : ``;
   output = output && inch ? `-${output}` : output;
   output = inch ? `${inch}${output}` : output;
   output = output ? `${output}"` : output;
   output = ft ? `${ft}' ${output}` : output;

   return output.trim();
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

/**
 * Solves a cubic equation
 * @param {number} a The cubed part of the equation
 * @param {number} b The squared part of the equation
 * @param {number} c The number multiplied by x
 * @param {number} d The constant
 */
export const solveCubic = (a = 0, b = 0, c = 0, d = 0) => {
   if (Math.abs(a) < 1e-8) {
      a = b;
      b = c;
      c = d;

      if (Math.abs(a) < 1e-8) {
         a = b;
         b = c;
         if (Math.abs(a) < 1e-8) return [];

         return [-b / a];
      }
   }

   const p = (3 * a * c - b * b) / (3 * a * a);
   const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
   let roots = [];

   if (Math.abs(p) < 1e-8) {
      roots = [Math.cbrt(-q)];
   } else if (Math.abs(q) < 1e-8) {
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
   } else {
      const _d = (q * q) / 4 + (p * p * p) / 27;

      if (Math.abs(_d) < 1e-8) {
         roots = [(-1.5 * q) / p, (3 * q) / p];
      } else if (_d > 0) {
         let u = Math.cbrt(-q / 2 - Math.sqrt(_d));
         roots = [u - p / (3 * u)];
      } else {
         let u = 2 * Math.sqrt(-p / 3);
         let t = Math.acos((3 * q) / p / u) / 3;
         let k = (2 * Math.PI) / 3;
         roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
      }
   }

   roots = roots.map((root) => (root -= b / (3 * a)));

   return roots;
};
