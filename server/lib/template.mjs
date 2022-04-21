/**
 * @module template Library for processing html templates
 */

// Node Imports
import { readFileSync } from 'fs';

// Project Imports
import { env } from '../lib/env.mjs';

/** The location of the template files */
const baseDir = '../../src/html';

// Environment variables
const protocol = process.env.PROTOCOL || env.PROTOCOL;

const host = process.env.HOST || env.HOST;

const port = process.env.PORT || env.PORT;

const name = process.env.NAME || env.NAME;

const baseUrl = `${protocol}://${host}` + (name === 'development' ? `:${port}` : '');

/**
 * Returns the file data from src/html directory
 * @param {string} file The location of the file
 */
export const getTemplate = (file) => {
   const filePath = new URL(`${baseDir}/${file}`, import.meta.url);

   try {
      const fileData = readFileSync(filePath, 'utf8');
      return fileData;
   } catch (error) {
      console.log(error);

      return undefined;
   }
};

/**
 * Inserts property data into the html file
 * @param {string} fileData The html file data
 * @param {object} props The properties to inject in the file
 */
export const build = (fileData, props) => {
   props = { ...props, baseUrl };

   for (const key in props) {
      const value = props[key];
      const find = new RegExp(`{{${key}}}`, 'g');
      fileData = fileData.replace(find, value);
   }

   return fileData;
};
