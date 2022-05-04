self.addEventListener('install', (event) => {
   console.log('Installing Service Worker');

   // caches.open('d');
});

self.addEventListener('activate', (event) => {
   console.log('Activating Service Worker');
   return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
   console.log('fetching...');
   event.respondWith(fetch(event.request));
});
