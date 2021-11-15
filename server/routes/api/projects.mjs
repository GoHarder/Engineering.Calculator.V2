/**
 * @module projects The projects route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { verifyToken } from '../../lib/crypto.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import * as validate from '../../lib/validate.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Get
router.get('/', (req, res) => {
   res.status(200).send();
});
