/**
 * @module api The api route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { router as tokens } from './tokens.mjs';
import { router as users } from './users.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Tokens
router.use('/tokens', tokens);

// - Users
router.use('/users', users);
