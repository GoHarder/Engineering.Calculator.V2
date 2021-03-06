/**
 * @module mongodb Creates the client for mongodb
 */

// NPM Imports
import { MongoClient } from 'mongodb';

// Project Imports
import { env } from '../../lib/env.mjs';
import { style } from '../../lib/terminal.mjs';

// The environment variables
const name = process.env.NAME || env.NAME;

const mongoUrl = process.env.MONGO_URL || env.MONGO_URL;

/** The database client */
let client = undefined;

/** The application database */
export let app = undefined;

/** The engineering database */
export let eng = undefined;

/** Connects to the database */
const connect = async () => {
   if (client) {
      console.log('Client already exists.');
      return;
   }

   const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   };

   try {
      client = await MongoClient.connect(mongoUrl, options);
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};

/** Starts the mongodb database */
export const init = async () => {
   const connected = await connect();

   if (connected) {
      // Create the database exports
      app = client.db(name === 'production' ? 'app' : 'app_dev');
      eng = client.db('engineering');

      console.log(`${style('✓', { color: 'green' })} Connected to mongodb`);
      return true;
   } else {
      console.log(`${style('X', { color: 'red' })} Connected to mongodb`);
      return false;
   }
};
