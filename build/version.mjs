/**
 * @module version updates the version of the application
 */

// Node Imports
import { openSync, closeSync, readFileSync, writeFileSync } from 'fs';

// Project Imports
import { style } from '../server/lib/terminal.mjs';

/**
 * Reads a file
 * @param {string} path The location of the file
 */
const readFile = (path) => {
   const url = new URL(path, import.meta.url);

   try {
      const fileData = readFileSync(url, 'utf8');

      return fileData;
   } catch (error) {
      console.log(error);
      return undefined;
   }
};

/**
 * Reads a JSON file and parses it
 * @param path The location of the file
 */
const readJson = (path) => {
   let fileData = readFile(path);

   try {
      fileData = JSON.parse(fileData);

      return fileData;
   } catch (error) {
      console.log(error);
      return undefined;
   }
};

// Get the data to process
const { version } = readJson('../package.json');
let date = new Date(Date.now());
date = date.toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });

// Process the html template
let index = readFile('../src/html/_index.html');
index = index.replace('{{date}}', date);
index = index.replace('{{version}}', version);
index = index.replace(/\s+<!--\s\w+\s-->/g, '');

const indexFileDesc = openSync(new URL('../src/html/index.html', import.meta.url), 'w');

writeFileSync(indexFileDesc, index);
closeSync(indexFileDesc);

let packLock = readJson('../package-lock.json');
packLock.version = version;
const packLockFileDesc = openSync(new URL('../package-lock.json', import.meta.url), 'w');
writeFileSync(packLockFileDesc, JSON.stringify(packLock, null, 3));
closeSync(packLockFileDesc);

console.log(`${style('✓', { color: 'green' })} Version Updated`);
