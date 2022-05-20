import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

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
