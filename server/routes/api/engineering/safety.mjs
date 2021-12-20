/**
 * @module safety The safety route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkAuth, checkCache]);

// Routes

// - Get
router.get('/', async (req, res) => {
   const { query } = req;

   const speed = parseInt(query.speed);

   let docs = [];

   try {
      docs = await engDB
         .collection('safeties')
         .find({ 'limits.speed': { $gte: speed } }, { projection: { _id: 0 }, sort: { name: 1 } })
         .toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
