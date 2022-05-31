/**
 * @store loading
 * This store holds initial values for PWA features
 */

// Imports
import { writable } from 'svelte/store';

let mobile;

if (navigator.userAgentData) {
   mobile = navigator.userAgentData.mobile;
} else {
   mobile = /Mobi|Android/i.test(navigator.userAgent);
}

// Creates the custom store and sets up renewal loop
const { set, subscribe, update } = writable({ serviceWorker: false, syncManager: false, mobile });

// Export the store object
export default {
   set,
   subscribe,
   update,
};
