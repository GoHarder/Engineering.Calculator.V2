/**
 * @module string A module for various string operations
 */

/**
 * Capitalizes a string
 * @param str The string to convert
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Converts a string to camel case
 * @param str The string to convert
 */
export const toCamelCase = (str) => {
   return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
   });
};
