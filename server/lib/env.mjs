/**
 * @module env Processes the server .env file
 */

// Node Imports
import { readFileSync } from 'fs';

// Project Imports
import { toCamelCase } from '../../lib/string.mjs';

/**
 * Converts a string to a JSON value
 * @param str The string to convert
 */
const parseValue = (str) => {
   try {
      return JSON.parse(str);
   } catch (error) {
      return str;
   }
};

/** Gets the data from the environment file */
const getEnvFile = () => {
   try {
      const path = new URL('../../.env', import.meta.url);
      let fileData = readFileSync(path, 'utf8');

      // Split string into array
      fileData = fileData.split('\n');

      // Remove \r at the end of each line
      fileData = fileData.map((line) => line.replace('\r', ''));

      // Remove empty lines
      fileData = fileData.filter((line) => line);

      // Remove comments
      fileData = fileData.filter((line) => !line.match(/^#/));

      // Create obj and set the env variable and return the data
      fileData = fileData.reduce((obj, line) => {
         let key = line.replace(/(^\w+)=.+/g, '$1');
         let value = line.replace(/^\w+=(.+)/g, '$1');

         obj[key] = parseValue(value);

         return obj;
      }, {});

      // Create the base url string
      fileData.BASE_URL = `${fileData.PROTOCOL}://${fileData.HOST}:${fileData.PORT}`;

      return fileData;
   } catch (error) {
      return {};
   }
};

/** The server environment */
export let env = (function () {
   const file = getEnvFile();
   let result = {};

   for (const key in file) {
      const value = file[key];

      let keyName = toCamelCase(key.replace(/_/g, ' ').toLowerCase());

      result[keyName] = process.env[key] || value;
   }

   return result;
})();
