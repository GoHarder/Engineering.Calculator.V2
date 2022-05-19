/**
 * @module app-shell updates the service worker application shell
 */

// Node Imports
import { readdir, writeFile } from 'fs/promises';

// Project Imports
import { style } from '../server/lib/terminal.mjs';

const config = [
   {
      name: 'public',
      ignore: ['.gitignore', 'app.js.map', 'favicon.ico', 'icons', 'manifest.json', 'sw.js.map'],
   },
   {
      name: 'img',
      ignore: ['vantage-email-logo.png'],
   },
];

const getFiles = async (name, path = '') => {
   const url = new URL(path, import.meta.url);
   const ignore = config.find((item) => item.name === name)?.ignore;
   let fileNames = await readdir(url);

   if (ignore) fileNames = fileNames.filter((fileName) => !ignore.includes(fileName));

   const dirs = fileNames.filter((name) => name.match(/^\w+[^\.]$/));
   let files = fileNames.filter((name) => name.match(/\.\w+$/));

   const pre = path.replace(/\.\.\/public/, '');

   files = files.map((name) => `${pre}/${name}`);

   for (const dir of dirs) {
      const recursion = await getFiles(dir, `${path}/${dir}`);
      files = [...files, ...recursion];
   }

   return files;
};

const init = async () => {
   const list = await getFiles('public', '../public');
   const url = new URL('../src/json/app-shell.json', import.meta.url);
   await writeFile(url, JSON.stringify(list, null, 3));
};

init().then(() => {
   console.log(`${style('✓', { color: 'green' })} Application Shell Updated`);
});
