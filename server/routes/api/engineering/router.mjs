/**
 * @module engineering The engineering route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { router as platform } from './platform.mjs';
import { router as safety } from './safety.mjs';
import { router as shoes } from './shoes.mjs';
import { router as sling } from './sling.mjs';
import { router as steel } from './steel.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - API
router.use('/platform', platform);

router.use('/safety', safety);

router.use('/shoes', shoes);

router.use('/sling', sling);

router.use('/steel', steel);
