import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly, Strategy } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { openDB } from 'idb';

class IDB {
   #name;
   #version;
   #stores;

   constructor(name, version, stores) {
      this.#name = name;
      this.#version = parseInt(version.replace(/\./g, ''));
      this.#stores = stores;

      openDB(name, parseInt(version.replace(/\./g, '')), {
         upgrade(db) {
            stores.forEach((store) => {
               if (db.objectStoreNames.contains(store)) {
                  db.deleteObjectStore(store);
               }

               db.createObjectStore(store, { keyPath: 'id' });
            });

            if (db.objectStoreNames.contains('db-entries')) {
               db.deleteObjectStore('db-entries');
            }

            const app = db.createObjectStore('db-entries', { keyPath: 'id' });
            app.createIndex('dbName', 'dbName');
            app.createIndex('timestamp', 'timestamp');
         },
      });
   }

   get #db() {
      return openDB(this.#name, this.#version);
   }

   async get(dbName, url) {
      const id = `${dbName}|${url}`;
      const db = await this.#db;
      const entryDoc = await db.get('db-entries', id);

      if (!entryDoc) return;

      return db.get('engineering', url);
   }

   async set(dbName, url, body) {
      const id = `${dbName}|${url}`;
      const db = await this.#db;

      const tag = {
         url,
         timestamp: Date.now(),
         dbName,
         id,
      };

      const entry = {
         id: url,
         body,
      };

      // db.put('db-entries', tag);
      // db.put('engineering', entry);
   }

   // export async function del(key) {
   //    return (await dbPromise).delete('keyval', key);
   // }
   // export async function clear() {
   //    return (await dbPromise).clear('keyval');
   // }
   // export async function keys() {
   //    return (await dbPromise).getAllKeys('keyval');
   // }
}

const manifest = self.__WB_MANIFEST;

const version = manifest[manifest.length - 1].revision;

const engineeringDB = new IDB('mongo-local', version, ['engineering']);

class EngineeringDB extends Strategy {
   constructor(options) {
      super(options);
      this.dbName = options.dbName;
   }

   _handle(request, handler) {
      const dbReq = engineeringDB.get('engineering', request.url);
      const fetchReq = handler.fetch(request);

      return new Promise(async (res, rej) => {
         const results = await Promise.all([dbReq, fetchReq]);
         const clone = results[1].clone();

         if (results[0]) {
            const body = JSON.stringify(results[0].body);
            const response = new Response(body, {
               status: 200,
               statusText: 'OK',
               url: request.url,
            });

            res(response);
         }

         res(clone);

         const response = results[1];

         if (response.status !== 200) return;

         const body = await response.json();

         engineeringDB.set('engineering', request.url, body);
      });
   }
}

class LocalStoragePlugin {
   constructor(key) {
      this.key = key;
   }

   fetchDidSucceed({ response }) {
      if (response.ok) return response;
   }

   fetchDidFail() {
      console.log('Response Failed');
      const token = localStorage.getItem(this.key);
      return token;
   }
}

precacheAndRoute(manifest);

cleanupOutdatedCaches();

registerRoute(
   /.*(?:googleapis|gstatic)\.com.*$/,
   new CacheFirst({
      cacheName: 'google-api',
      plugins: [
         new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
         }),
      ],
   })
);

registerRoute(
   /.*\/api\/tokens/,
   new NetworkOnly({
      plugins: [new LocalStoragePlugin('token')],
   }),
   'PUT'
);

registerRoute(
   /.*\/api\/engineering/,
   new EngineeringDB({
      dbName: 'engineering',
   })
);
