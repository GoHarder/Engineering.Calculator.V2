import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly, Strategy } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';
import { openDB } from 'idb';

const manifest = self.__WB_MANIFEST;

const idbLifespan = new Map([
   ['buffers', { time: 7 * 24 * 60 * 60 * 1000, qty: 20 }],
   ['counterweight', { time: 7 * 24 * 60 * 60 * 1000, qty: 20 }],
   ['machine', { time: 7 * 24 * 60 * 60 * 1000, qty: 20 }],
   ['overhead-steel', { time: 30 * 24 * 60 * 60 * 1000, qty: 2 }],
   ['platform', { time: 7 * 24 * 60 * 60 * 1000, qty: 3 }],
   ['safety', { time: 7 * 24 * 60 * 60 * 1000, qty: 20 }],
   ['shoes', { time: 7 * 24 * 60 * 60 * 1000, qty: 20 }],
   ['sling', { time: 7 * 24 * 60 * 60 * 1000, qty: 1 }],
]);

const idb = openDB('mongo', 1, {
   upgrade(db) {
      const col = db.createObjectStore('engineering', { keyPath: 'url' });
      col.createIndex('collection', 'collection');
      col.createIndex('timestamp', 'timestamp');
   },
});

const idbGet = async (collection, key) => {
   return (await idb).get(collection, key);
};

const idbGetAllFromIndex = async (collection, index, query) => {
   return (await idb).getAllFromIndex(collection, index, query);
};

const idbPut = async (collection, value) => {
   return (await idb).put(collection, value);
};

class EngineeringDb extends Strategy {
   constructor(options) {
      super(options);
   }

   async _handle(request, handler) {
      const { url } = request;
      const collection = url.match(/.*\/engineering\/([\w-]+)/)[1];
      const lifespan = idbLifespan.get(collection);

      try {
         const { timestamp, body } = await idbGet('engineering', url);

         if (Date.now() - lifespan.time > timestamp) throw new Error('Document is stale');

         return new Response(JSON.stringify(body), { status: 200, statusText: 'OK', headers: [['X-Service', 'Test']] });
      } catch (error) {
         // console.log(error);
         return handler.fetch(request);
      }
   }

   async _awaitComplete(responseDone, handler, request, event) {
      let response;
      let error;

      try {
         response = await responseDone;

         const clone = response.clone();
         const { url } = clone;
         const collection = url.match(/.*\/engineering\/([\w-]+)/)[1];
         const maxQty = idbLifespan.get('overhead-steel').qty;
         const body = await clone.json();

         const entry = {
            collection,
            timestamp: Date.now(),
            url,
            body,
         };

         await idbPut('engineering', entry);

         // NOTE: 5-26-2022 11:53 AM - This cleans up the database

         const docs = await idbGetAllFromIndex('engineering', 'collection', IDBKeyRange.only('overhead-steel'));

         if (docs.length <= maxQty) return;

         let urls = docs.sort((docA, docB) => docB.timestamp - docA.timestamp);
         urls = urls.map((doc) => doc.url);
         urls = urls.slice(0, maxQty);

         const tx = await (await idb).transaction('engineering', 'readwrite');
         const index = tx.store.index('collection');
         let cursor = await index.openCursor(IDBKeyRange.only('overhead-steel'));

         while (cursor) {
            const doc = cursor.value;
            if (!urls.includes(doc.url)) await cursor.delete();
            cursor = await cursor.continue();
         }

         await tx.done;
      } catch (error) {}

      try {
         await handler.runCallbacks('handlerDidRespond', {
            event,
            request,
            response,
         });
         await handler.doneWaiting();
      } catch (waitUntilError) {
         error = waitUntilError;
      }

      await handler.runCallbacks('handlerDidComplete', {
         event,
         request,
         response,
         error,
      });

      handler.destroy();

      if (error) {
         throw error;
      }
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
      const token = localStorage.getItem(this.key);
      return token;
   }
}

precacheAndRoute(manifest);

cleanupOutdatedCaches();

clientsClaim();

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

registerRoute(/.*\/api\/engineering\/(?:(?!steel))/, new EngineeringDb());

registerRoute(
   /.*\/api\/projects/,
   new NetworkOnly({
      plugins: [new BackgroundSyncPlugin('project-post')],
   }),
   'POST'
);

registerRoute(
   /.*\/api\/projects/,
   new NetworkOnly({
      plugins: [new BackgroundSyncPlugin('project-put')],
   }),
   'PUT'
);

registerRoute(
   /.*\/api\/projects/,
   new NetworkOnly({
      plugins: [new BackgroundSyncPlugin('project-delete')],
   }),
   'DELETE'
);

// .*\/api\/projects\/id\/\w{24} 20 projects
