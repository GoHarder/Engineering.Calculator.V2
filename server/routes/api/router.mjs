/**
 * @module api The api route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { router as engineering } from './engineering/router.mjs';
import { router as projects } from './projects.mjs';
import { router as tokens } from './tokens.mjs';
import { router as users } from './users.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Engineering
router.use('/engineering', engineering);

// - Projects
router.use('/projects', projects);

// - Tokens
router.use('/tokens', tokens);

// - Users
router.use('/users', users);
