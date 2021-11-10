/**
 * @module build Builds the application for release
 */

// Node Imports
import { openSync, closeSync, readFileSync, writeFileSync } from 'fs';

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
const { date, version } = readJson('./release.json');

// Process the html template
let index = readFile('../src/html/_index.html');
index = index.replace('{{date}}', date);
index = index.replace('{{version}}', version);

const indexFileDesc = openSync(new URL('../src/html/index.html', import.meta.url), 'w');

writeFileSync(indexFileDesc, index);
closeSync(indexFileDesc);

// Process the package files
let pack = readJson('../package.json');
pack.version = version;
const packFileDesc = openSync(new URL('../package.json', import.meta.url), 'w');
writeFileSync(packFileDesc, JSON.stringify(pack));
closeSync(packFileDesc);

let packLock = readJson('../package-lock.json');
packLock.version = version;
const packLockFileDesc = openSync(new URL('../package-lock.json', import.meta.url), 'w');
writeFileSync(packLockFileDesc, JSON.stringify(packLock));
closeSync(packLockFileDesc);

console.log('Pre-build Done');
