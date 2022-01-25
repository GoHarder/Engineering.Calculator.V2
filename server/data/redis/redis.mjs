/**
 * @module mongodb Creates the client for redis
 */

// NPM Imports
import { createClient } from 'redis';

// Project Imports
import { env } from '../../lib/env.mjs';
import { style } from '../../lib/terminal.mjs';

// The environment variables
const cache = process.env.CACHE || env.CACHE;

const url = process.env.REDIS_URL || env.REDIS_URL;

/** The database client */
let client = undefined;

/** The default expiration (12h) */
const defaultExp = 43200;

/** Connects to the database */
const connect = async () => {
   const options = {
      url,
   };

   client = createClient(options);

   client.on('error', (error) => {});

   try {
      await client.connect();
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};

/**
 * Gets a document in the cache
 * @param {string} key The document key
 */
export const get = async (key) => {
   if (!cache) return false;

   let res;

   try {
      res = await client.get(key);
   } catch (error) {
      console.log(error);
      return false;
   }

   return res;
};

/**
 * Gets a document in the cache
 * @param {string} key The document key
 * @param {number} ttl The time the document will exist in cache
 */
export const expire = async (key, ttl = defaultExp) => {
   if (!cache) return false;

   let res;

   try {
      res = await client.expire(key, ttl);
   } catch (error) {
      console.log(error);
      return false;
   }

   return res;
};

/**
 * Sets a document in the cache for a certain amount of time
 * @param {string} key The document key
 * @param {object} value The document to store
 * @param {number} ttl The time the document will exist in cache
 */
export const setEx = async (key, value, ttl = defaultExp) => {
   if (!cache) return false;

   let res;

   try {
      res = await client.setEx(key, ttl, value);
   } catch (error) {
      console.log(error);
      return false;
   }

   return res;
};

/** Starts the redis database */
export const init = async () => {
   if (!cache) return true;

   const connected = await connect();

   // const test = await client.setEx('test1', 60, 'test1');

   // console.log(test);

   if (connected) {
      console.log(`${style('✓', { color: 'green' })} Connected to redis`);
      return true;
   } else {
      console.log(`${style('X', { color: 'red' })} Connected to redis`);
      return false;
   }
};
