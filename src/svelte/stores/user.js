/**
 * @store user
 * This store holds user and security information
 */

// Imports
import { writable } from 'svelte/store';
import fetchStore from './fetch';

/**
 * Gets the user data
 * @param {string} token The security token
 */
const getUser = async (token) => {
   let res, body;

   try {
      res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });

      if (res.body && res.status !== 204) body = await res.json();

      if (!res.ok) throw new Error(body.message);

      return body;
   } catch (error) {
      fetchStore.setError({ res, error });
      return undefined;
   }
};

// Creates the custom store and sets up renewal loop
const { subscribe, set: _set } = writable(localStorage.getItem('token'), async (set) => {
   // Set the default state
   set(undefined);

   // See if there is a token
   let token = localStorage.getItem('token');

   // Token retry errors
   let errors = 0;

   // If there is a token get user data and set it
   if (token) {
      const user = await getUser(token);
      set(user);
   }

   // Create interval to renew the token with the server
   const interval = setInterval(async () => {
      token = localStorage.getItem('token');

      if (token) {
         let res, body;

         try {
            res = await fetch('/api/tokens', {
               method: 'PUT',
               headers: { Authorization: `Bearer ${token}` },
            });

            if (res.body && res.status !== 204) body = await res.json();

            if (!res.ok) throw new Error(body.message);

            localStorage.setItem('token', token);
            errors = 0;
         } catch (error) {
            fetchStore.setError({ res, error });
            errors++;
         }

         if (errors >= 3) {
            localStorage.clear();
            set(undefined);
         }
      }
   }, 60 * 1000);

   return () => clearInterval(interval);
});

/**
 * Set the security token
 * @param {string} token The security token to store
 */
const set = async (token) => {
   // Set the token
   localStorage.setItem('token', token);

   // Get the user and set store
   const user = await getUser(token);
   _set(user);
};

/** Deletes the user data */
const destroy = () => {
   // Delete the token and clear the store
   localStorage.clear();
   _set(undefined);
};

// export the store object
export default {
   destroy,
   set,
   subscribe,
};
