/**
 * @module shoes The shoes route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { getShoes } from '../../../data/mongodb/pipelines/shoes.mjs';
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

   const capacity = parseInt(query.capacity);
   const speed = parseInt(query.speed);

   let docs = [];

   const _shoes = getShoes(capacity, speed);

   try {
      docs = await engDB.collection('shoes').aggregate(_shoes).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
