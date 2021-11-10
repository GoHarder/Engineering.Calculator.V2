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
import { getEnv } from './env/env.mjs';
import { style } from './terminal.mjs';

/** The server environment */
const env = getEnv();

/** The express server instance */
const server = express();

/** The port the server receives requests */
const port = process.env.PORT || 3000;

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

// - Ping route
server.get('/ping', (req, res) => {
   res.status(202).send();
});

// - Public static file route
server.use(express.static('./public'));

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

         console.log('\x1b[0m%s\x1b[32m%s\x1b[0m', 'Server started ', '✓');
         res(true);
      } catch (error) {
         console.log('\x1b[0m%s\x1b[31m%s\x1b[0m', 'Server started ', 'X');
         console.log();
         rej(error);
      }
   });
};
