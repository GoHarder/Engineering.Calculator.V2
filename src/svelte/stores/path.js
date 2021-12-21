/**
 * @store path
 * This store holds the path used in the history API
 */

// Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { set, subscribe } = writable(['Login']);

// export the store object
export default {
   set,
   subscribe,
};
