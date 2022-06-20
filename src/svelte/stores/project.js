/**
 * @store token
 * This store holds the project data
 */

// Imports
import { writable } from 'svelte/store';
import initStore from './init';
import fetchStore from './fetch';
import userStore from './user';

/**
 * Saves the project internally
 * @param {object} project The project object
 */
const saveProject = async (project, sendError = true) => {
   // Prepare request information
   const method = '_id' in project ? 'PUT' : 'POST';
   const token = localStorage.getItem('token');

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

      return body;
   } catch (error) {
      const { serviceWorker, syncManager } = pwa;

      if (serviceWorker && syncManager) {
         const sw = await navigator.serviceWorker.ready;
         sw.sync.register(`workbox-background-sync:project-${method.toLowerCase()}`);
         fetchStore.loading(false);
      } else {
         if (sendError) fetchStore.setError({ res, error });
      }

      return project;
   }
};

/** The user object */
let user = undefined;
let pwa = undefined;

initStore.subscribe((store) => (pwa = store));
userStore.subscribe((store) => (user = store));

// Creates the custom store and sets up renewal loop
const { subscribe, set: _set, update: _update } = writable({});

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
      const { serviceWorker, syncManager } = pwa;

      if (serviceWorker && syncManager) {
         const sw = await navigator.serviceWorker.ready;
         sw.sync.register('workbox-background-sync:project-post');
         fetchStore.loading(false);
      } else {
         fetchStore.setError({ res, error });
      }
   }

   _set({});
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
         const { serviceWorker, syncManager } = pwa;

         if (serviceWorker && syncManager) {
            const sw = await navigator.serviceWorker.ready;
            sw.sync.register('workbox-background-sync:project-delete');
            fetchStore.loading(false);
         } else {
            fetchStore.setError({ res, error });
         }
      }

      return {};
   });
};

/**
 * Saves the project
 * @param {object} project The project object
 */
const save = (project) => {
   let update = {};

   // Update locally first
   _update((store) => {
      update = { ...store, ...project };
      return update;
   });

   // Save to server
   saveProject(update);

   return update;
};

/**
 * Shares a project with another user
 * @param {object} project The project object
 * @param {string} email The user to send to
 */
const share = async (project, email) => {
   const token = localStorage.getItem('token');

   // Run fetch
   fetchStore.loading(true);
   let res, body;

   try {
      const payload = JSON.stringify(project);

      res = await fetch(`api/projects/share/${email}`, {
         method: 'PUT',
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
         body: payload,
      });

      if (res.body && res.status !== 204) body = await res.json();

      if (!res.ok) throw new Error(body.message);

      fetchStore.loading(false);

      _set(body);
   } catch (error) {
      const { serviceWorker, syncManager } = pwa;

      if (serviceWorker && syncManager) {
         const sw = await navigator.serviceWorker.ready;
         sw.sync.register('workbox-background-sync:project-put');
         fetchStore.loading(false);
      } else {
         fetchStore.setError({ res, error });
      }
   }
};

/**
 * Sets the project in the store
 * @param {object} project The project object
 */
const set = (project) => _set(project);

/**
 * Auto saves the project and sets up an sync event
 * @param {object} project The project object
 */
const sync = async (project) => {
   let update = {};
   let save = false;

   // Update locally first
   _update((store) => {
      save = JSON.stringify(store) !== JSON.stringify(project);
      update = { ...store, ...project };
      return update;
   });

   // Save to server
   if (save) saveProject(update, false);

   return update;
};

/**
 * Updates the project without saving
 * @param {object} project The project object
 */
const update = (project) => {
   let update = {};

   // Update locally first
   _update((store) => {
      update = { ...store, ...project };
      return update;
   });

   return update;
};

// export the store object
export default {
   clear,
   destroy,
   save,
   set,
   share,
   subscribe,
   sync,
   update,
};
