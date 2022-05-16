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
export const clone = (obj) => {
   try {
      return structuredClone(obj);
   } catch (error) {
      return JSON.parse(JSON.stringify(obj));
   }
};

/**
 * Merges two objects completely down the structure
 * @param {object} obj1 The object to merge into
 * @param {object} obj2 The object to merge in
 */
export const deepMerge = (obj1, obj2) => {
   const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

   let _obj1 = clone(obj1);
   let _obj2 = clone(obj2);

   Object.keys(_obj2).forEach((key) => {
      if (isObject(_obj2[key])) {
         if (key in _obj1) {
            // If value is in object then call a recursion
            _obj1[key] = deepMerge(_obj1[key], _obj2[key]);
         } else {
            // If value isn't in object then insert it
            Object.assign(_obj1, { [key]: _obj2[key] });
         }
      } else {
         // If value isn't an object then override it
         Object.assign(_obj1, { [key]: _obj2[key] });
      }
   });

   return _obj1;
};

/**
 * Delays the running of a function by its last call
 * @param {function} callback The callback function
 * @param {number} delay The delay before running the function
 */
export const debounce = (callback, delay = 0) => {
   let timeout = undefined;

   return (...args) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
         callback(...args);
      }, delay);
   };
};

/**
 * Run a function and delay when it is run again
 * Good for resizing windows or mouse movements
 * @param {function} callback The callback function
 * @param {number} delay They delay before running the function
 */
export const throttle = (callback, delay = 0) => {
   let waiting = false;
   let argsQueue = undefined;

   const timeout = () => {
      if (argsQueue) {
         callback(...argsQueue);
         argsQueue = undefined;
         setTimeout(timeout, delay);
      } else {
         waiting = true;
      }
   };

   return (...args) => {
      if (waiting) {
         argsQueue = args;
         return;
      }

      callback(...args);
      waiting = true;
      setTimeout(timeout, delay);
   };
};
