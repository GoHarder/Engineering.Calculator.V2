/**
 * @module steel The steel route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { router as steel } from './steel.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - API
router.get('/', (req, res) => {
   console.log(req);

   res.status(200).json({ message: 'ding' });
});
