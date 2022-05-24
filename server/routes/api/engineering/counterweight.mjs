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
   let { speed, capacity, roping } = req.query;

   speed = parseInt(speed);
   capacity = parseInt(capacity);
   roping = parseInt(roping);

   let models = [];
   let sheaves = [];
   let shoePlates = [];

   try {
      models = await engDB
         .collection('counterweights')
         .find({ roping }, { projection: { roping: 0, _sort: 0 }, sort: { _sort: 1 } })
         .toArray();

      sheaves = await engDB
         .collection('sheaves')
         .find({ _uses: 'counterweight' }, { sort: { diameter: 1, rimWidth: 1 } })
         .toArray();

      shoePlates = await engDB.collection('shoe_plates').find().toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   const docs = { models, sheaves, shoePlates };

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
