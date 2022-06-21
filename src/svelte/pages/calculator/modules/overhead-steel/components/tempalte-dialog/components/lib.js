/**
 * Creates an object with alphabetical keys
 * @param {number} size The size of the object
 * @returns
 */
export const dimObj = (size) => {
   const output = {};
   const keys = 'abcdefghijklmnopqrstuvwxyz';

   for (let i = 0; i < size; i++) {
      const key = keys[i];
      output[key] = 0;
   }

   return output;
};
