import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

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

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(
   /.*(?:googleapis|gstatic)\.com.*$/,
   new StaleWhileRevalidate({
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
