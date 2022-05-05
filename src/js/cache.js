/**
 * Caches an array of url strings
 * @param {string} cacheName The name of the cache
 * @param {[string]} assets The array of urls to cache
 */
export const cacheAll = async (cacheName, assets) => {
   const cache = await caches.open(cacheName);
   await cache.addAll(assets);
};

/**
 * Removes all the old caches
 * @param {[string]} currentNames The array of current caches names
 */
export const cleanCaches = async (currentNames) => {
   const keys = await caches.keys();
   Promise.all(
      keys.map((key) => {
         if (!currentNames.includes(key)) caches.delete(key);
      })
   );
};

/**
 * Puts an asset into the cache
 * @param {string} cacheName The name of the cache
 * @param {object} req The request object
 * @param {object} res The response object
 */
const putInCache = async (cacheName, req, res) => {
   const cache = await caches.open(cacheName);
   await cache.put(req, res);
};

/**
 * Responds to a request from the cache first then the server
 * @param {string} cacheName The name of the cache
 * @param {object} req The request object
 */
export const cacheFirst = async (cacheName, req) => {
   const cacheRes = await caches.match(req);
   if (cacheRes) return cacheRes;

   const serverRes = await fetch(req);
   putInCache(cacheName, req, serverRes.clone());
   return serverRes;
};
