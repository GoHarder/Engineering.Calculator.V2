/**
 * @module server Creates the server for the application
 */

// Node Imports
import { readFileSync } from 'fs';
import http from 'http';
import https from 'https';

// NPM Imports
import express from 'express';

// Project Imports
import { getEnv } from './lib/env.mjs';
import { style } from './lib/terminal.mjs';
import { router } from './routes/router.mjs';

/** The server environment */
const env = getEnv();

/** The express server instance */
const server = express();

/** The port the server receives requests */
const port = process.env.PORT || env.port;

/** The https certificate data */
let cert = undefined;

/** The https certificate key data */
let key = undefined;

/** The http server */
let httpServer;

/** the https server */
let httpsServer;

// Request body parsing
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Routes
server.use(router);

/** Starts the server */
export const init = () => {
   return new Promise((res, rej) => {
      try {
         // Load https files
         cert = readFileSync(new URL('./certs/cert.pem', import.meta.url), 'utf-8');
         key = readFileSync(new URL('./certs/key.pem', import.meta.url), 'utf-8');

         // Create the servers
         httpServer = http.createServer(server);
         httpsServer = https.createServer({ cert, key }, server);

         if (env.protocol === 'https') {
            httpsServer.listen(port);
         } else {
            httpServer.listen(port);
         }

         console.log(`Server started ${style('✓', { color: 'green' })}`);
         res(true);
      } catch (error) {
         console.log(`Server started ${style('X', { color: 'red' })}\n`);
         rej(error);
      }
   });
};
