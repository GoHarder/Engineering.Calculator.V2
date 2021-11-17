/**
 * @store loading
 * This store holds if the system is loading or not and shows errors
 */

// Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { set: _set, subscribe, update: _update } = writable({ loading: false, errorData: undefined });

/**
 * Sets the loading state
 * @param {boolean} update The state update
 */
const loading = (update) => {
   _update((store) => {
      store.loading = update;
      return store;
   });
};

/**
 * Sets the error store with the update
 * @param {any} update The new errorData object
 * @param {Response} update.res The server response
 * @param {Error} update.error The error object
 */
const setError = (update) => {
   _update((store) => {
      if (!store.errorData) store.errorData = update;
      return store;
   });
};

/** Clears the error store */
const clearError = () => _set({ loading: false, errorData: undefined });

// Export the store object
export default {
   clearError,
   loading,
   setError,
   subscribe,
};
