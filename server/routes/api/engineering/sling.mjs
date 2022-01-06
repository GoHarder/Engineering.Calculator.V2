/**
 * @module sling The sling route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { _channels, _topChannels } from '../../../data/mongodb/pipelines/sling.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkAuth, checkCache]);

// Routes

// - Get
router.get('/', async (req, res) => {
   let channels = [];
   let models = [];
   let sheaves = [];
   let shoePlates = [];
   let topChannels = [];

   try {
      channels = await engDB.collection('steel').aggregate(_channels).toArray();

      sheaves = await engDB
         .collection('sheaves')
         .find({ _uses: 'car' }, { projection: { _id: 0 }, sort: { diameter: 1, rimWidth: 1 } })
         .toArray();

      models = await engDB
         .collection('slings')
         .find({}, { projection: { _id: 0, _sort: 0 }, sort: { _sort: 1 } })
         .toArray();

      shoePlates = await engDB
         .collection('shoe_plates')
         .find({}, { projection: { _id: 0 } })
         .toArray();

      topChannels = await engDB.collection('steel').aggregate(_topChannels).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json({ channels, models, sheaves, shoePlates, topChannels });
});
