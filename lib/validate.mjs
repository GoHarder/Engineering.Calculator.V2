/**
 * @module validate Library to validate data
 */

/**
 * Verifies a string
 * @param {string} value The value to be verified
 */
export const string = (value) => typeof value === 'string' && value.trim().length > 0;

/**
 * Verifies a boolean
 * @param {boolean} value The value to be verified
 */
export const boolean = (value) => typeof value === 'boolean';

/**
 * Verifies an integer
 * @param {number} int The value to be verified
 */
export const int = (value) => {
   let output = false;

   if (!string(value)) output = parseInt(value) === Number(value);

   return output;
};

/**
 * Verifies valid email strings
 * @param {string} value The value to be verified
 */
export const email = (value) => {
   const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   let output = false;

   if (string(value)) output = regex.test(value);

   return output;
};

/**
 * Verifies a valid password
 * @param {string} string The value to be verified
 */
export const password = (value) => {
   const regex = /^(?=.*[~!@#$%^&*()_\+\-\=])(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S{8,15}$/;
   let output = false;

   if (string(value)) output = regex.test(value);

   return output;
};

/**
 * Verifies an object based on a schema
 * @param {object} object The object to be verified
 * @param {object} schema The schema to check the object
 */
export const schema = (object, schema) => {
   if (object && schema) {
      const errors = Object.keys(schema)
         .filter((key) => !schema[key](object[key]))
         .map((key) => `${key}`);

      return errors.length === 0 ? { valid: true } : { valid: false, errors };
   }

   return { valid: false };
};
