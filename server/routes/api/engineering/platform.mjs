/**
 * @module platform The platform route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth } from '../../../middleware/lib.mjs';
import { _angle } from '../../../data/mongodb/pipelines/platform.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use(checkAuth);

// Routes

// - Get
router.get('/wood', async (req, res) => {
   let docs;

   try {
      docs = await engDB.collection('steel').aggregate(_angle).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   res.status(200).json(docs);
});
