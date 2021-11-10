/**
 * @module base The base route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { getEnv } from '../env.mjs';

/** The router for the module */
export const router = express.Router();

// Main html page
router.get('/', (req, res) => {
   const { baseUrl } = getEnv();

   console.log(baseUrl);

   res.status(200).send(baseUrl);
});

// Ping
router.get('/ping', (req, res) => {
   res.status(202).send();
});
