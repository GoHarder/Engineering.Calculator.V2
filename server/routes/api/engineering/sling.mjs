/**
 * @module sling The sling route handler
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
   let models = [];
   let shoePlates = [];

   try {
      models = await engDB
         .collection('slings')
         .find({}, { projection: { _id: 0, _sort: 0 }, sort: { _sort: 1 } })
         .toArray();

      shoePlates = await engDB.collection('shoe_plates').find().toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   // await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json({ models, shoePlates });
});
