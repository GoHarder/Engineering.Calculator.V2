/**
 * @module engineering The engineering route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { router as platform } from './platform.mjs';
import { router as steel } from './steel.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - API
router.use('/platform', platform);

router.use('/steel', steel);
