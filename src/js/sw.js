import { version } from '../../package.json';
import { cacheAll, cacheFirst, cleanCaches } from './cache';

const staticName = `static v${version}`;
const dynamicName = `dynamic v${version}`;

const shell = [
   '/',
   '/app.css',
   '/app.js',
   '/img/vantage-logo.svg',
   'https://fonts.googleapis.com/icon?family=Material+Icons',
   'https://fonts.googleapis.com/css?family=Open+Sans',
];

const inShell = (string, array) => {
   let cachePath = string;
   if (string.indexOf(self.origin) === 0) cachePath = string.substring(self.origin.length);
   return array.indexOf(cachePath) > -1;
};

self.addEventListener('install', (event) => {
   event.waitUntil(cacheAll(staticName, shell));
});

self.addEventListener('activate', (event) => {
   event.waitUntil(cleanCaches([dynamicName, staticName]));
   self.clients.claim();
});

self.addEventListener('fetch', (event) => {
   if (event.request.url.match('^.*(fonts.gstatic).*$')) {
      event.respondWith(cacheFirst(dynamicName, event.request));
   }

   if (inShell(event.request.url, shell)) {
      event.respondWith(caches.match(event.request));
   }

   return false;
});
