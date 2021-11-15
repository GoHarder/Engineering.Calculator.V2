/**
 * @store token
 * This store holds the project data
 */

// Imports
import { writable } from 'svelte/store';
import fetchStore from './fetch';

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
   project._type = 'save';
   if (userId) project.checkout = userId;

   // Run fetch
   fetchStore.loading(true);
   let res, body;

   try {
      const payload = JSON.stringify(project);

      res = await fetch('api/proj', {
         method,
         headers: {
            'Content-Type': 'application/json',
            authorization: token,
         },
         body: payload,
      });

      if (res.body && res.status !== 204) body = await res.json();

      if (!res.ok) throw new Error(body.message);

      fetchStore.loading(false);

      return true;
   } catch (error) {
      fetchStore.setError({ res, error });
      return false;
   }
};

// Creates the custom store and sets up renewal loop
const { subscribe, set, update: _update } = writable(undefined);

/** Clears the project from the store */
const clear = () => set(undefined);

/** Deletes the project and clears the store */
const destroy = () => {
   _update(async (store) => {
      const id = store._id;

      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/proj/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
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
   set(project);

   // Send the request to save the project return if good
   return await saveProject(project, userId);
};

// export the store object
export default {
   clear,
   destroy,
   save,
   set,
   subscribe,
};
