/**
 * @store token
 * This store holds the project data
 */

// Imports
import { writable } from 'svelte/store';
import fetchStore from './fetch';
import userStore from './user';

/**
 * Saves the project internally
 * @param {object} project The project object
 * @param {string} userId The user id
 */
const saveProject = async (project, userId = undefined) => {
   // Prepare request information
   const method = '_id' in project ? 'PUT' : 'POST';
   const token = localStorage.getItem('token');

   // Prepare the payload
   if (userId) project.checkout = userId;

   // Run fetch
   fetchStore.loading(true);
   let res, body;

   try {
      const payload = JSON.stringify(project);

      res = await fetch('api/projects', {
         method,
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
         body: payload,
      });

      if (res.body && res.status !== 204) body = await res.json();

      if (!res.ok) throw new Error(body.message);

      fetchStore.loading(false);

      return res.body;
   } catch (error) {
      fetchStore.setError({ res, error });
      return false;
   }
};

/** The user object */
let user = undefined;

userStore.subscribe((store) => (user = store));

// Creates the custom store and sets up renewal loop
const { subscribe, set: _set, update: _update } = writable(undefined);

/** Clears the project from the store */
const clear = async () => {
   // Run fetch
   fetchStore.loading(true);
   let res, body;

   try {
      res = await fetch(`api/projects/check-in/${user._id}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (res.body && res.status !== 204) body = await res.json();

      if (!res.ok) throw new Error(body.message);

      fetchStore.loading(false);
   } catch (error) {
      fetchStore.setError({ res, error });
   }

   _set(undefined);
};

/** Deletes the project and clears the store */
const destroy = () => {
   _update(async (store) => {
      const token = localStorage.getItem('token');
      const id = store._id;

      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/projects/${id}`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
      } catch (error) {
         fetchStore.setError({ res, error });
      }

      return undefined;
   });
};

/**
 * Saves the project
 * @param {object} project The project object
 * @param {string} userId The user id
 */
const save = async (project, userId = undefined) => {
   // Set the store even though it may fail
   _set(project);

   // Send the request to save the project return if good
   const update = await saveProject(project, userId);

   if (update) _set(update);
};

/**
 * Sets the project in the store
 * @param {object} project The project object
 */
const set = (project) => _set(project);

// export the store object
export default {
   clear,
   destroy,
   save,
   set,
   subscribe,
};
