import '../scss/style.scss';
import initStore from 'stores/init.js';
import App from '../svelte/App.svelte';
import Nav from '../svelte/Nav.svelte';

// Start service worker
if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('public/sw.js', { scope: '/' });
   initStore.update((store) => {
      store = { ...store, serviceWorker: true, syncManager: 'SyncManager' in window };
      return store;
   });
}

window.addEventListener('beforeinstallprompt', (event) => {
   event.preventDefault();
   initStore.update((store) => {
      store = { ...store, installPrompt: event };
      return store;
   });
});

// Monkey patch to add a custom location change event to window
history.pushState = ((f) =>
   function pushState() {
      var ret = f.apply(this, arguments);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
   })(history.pushState);

history.replaceState = ((f) =>
   function replaceState() {
      var ret = f.apply(this, arguments);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
   })(history.replaceState);

window.addEventListener('popstate', () => {
   window.dispatchEvent(new Event('locationchange'));
});

/** Svelte navigation instance */
const svelteNav = new Nav({ target: document.querySelector('nav') });

/** Svelte application instance */
const svelteApp = new App({ target: document.querySelector('main') });
