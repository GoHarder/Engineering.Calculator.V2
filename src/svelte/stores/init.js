/**
 * @store loading
 * This store holds initial values for PWA features
 */

// Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { set, subscribe, update } = writable({});

// Export the store object
export default {
   set,
   subscribe,
   update,
};
