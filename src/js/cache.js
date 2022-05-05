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
