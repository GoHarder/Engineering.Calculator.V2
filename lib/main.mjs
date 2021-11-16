/**
 * @module main
 * A module for general functions.
 */

/**
 * Creates an incremented number array
 * @param {number} start The start of the range
 * @param {number} end The end of the range
 */
export const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);

/**
 * Clones an object to ensure it is a copy
 * @param {object} obj The oject to clone
 */
export const clone = (obj) => JSON.parse(JSON.stringify(obj));
